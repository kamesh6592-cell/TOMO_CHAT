import { tool as createTool } from "ai";
import { generateImageWithOpenRouter } from "lib/ai/image/generate-image";
import { serverFileStorage } from "lib/file-storage";
import { safe, watchError } from "ts-safe";
import z from "zod";
import { ImageToolName } from "..";
import logger from "logger";
import { ImageToolResult } from "./index";

export const openRouterImageTool = createTool({
  name: ImageToolName,
  description: `Generate images using OpenRouter's Google Gemini 2.5 Flash Image model. This tool analyzes the conversation context and generates images based on the user's request. Use this when the user asks for image creation or visual content generation.`,
  inputSchema: z.object({
    mode: z
      .enum(["create", "edit", "composite"])
      .optional()
      .default("create")
      .describe(
        "Image generation mode: 'create' for new images, 'edit' for modifying existing images, 'composite' for combining multiple images",
      ),
  }),
  execute: async ({ mode }, { messages, abortSignal }) => {
    try {
      const latestMessages = messages.slice(-6);

      const images = await generateImageWithOpenRouter({
        prompt: "",
        abortSignal,
        messages: latestMessages,
      });

      const resultImages = await safe(images.images)
        .map((images) => {
          return Promise.all(
            images.map(async (image) => {
              const uploadedImage = await serverFileStorage.upload(
                Buffer.from(image.base64, "base64"),
                {
                  contentType: image.mimeType,
                },
              );
              return {
                url: uploadedImage.sourceUrl,
                mimeType: image.mimeType,
              };
            }),
          );
        })
        .watch(
          watchError((e) => {
            logger.error(e);
            logger.info(`upload image failed. using base64`);
          }),
        )
        .ifFail(() => {
          throw new Error(
            "Image generation was successful, but file upload failed. Please check your file upload configuration and try again.",
          );
        })
        .unwrap();

      return {
        images: resultImages,
        mode,
        model: "google/gemini-2.5-flash-image (via OpenRouter)",
        guide:
          resultImages.length > 0
            ? "The image has been successfully generated using OpenRouter and is now displayed above. If you need any edits, modifications, or adjustments to the image, please let me know."
            : "I apologize, but the image generation was not successful. Please provide more specific details about what you'd like to see, and I'll try again.",
      } as ImageToolResult;
    } catch (e) {
      logger.error(e);
      throw e;
    }
  },
});
