import {
  ModelMessage,
  tool as createTool,
} from "ai";
import { generateImageWithHuggingFace } from "lib/ai/image/generate-image";
import { serverFileStorage } from "lib/file-storage";
import { safe, watchError } from "ts-safe";
import z from "zod";
import { ImageToolName } from "..";
import logger from "logger";

export const huggingFaceImageTool = createTool({
  name: ImageToolName,
  description: `Generate images using HuggingFace Inference API with Stable Diffusion. Has a FREE tier! Falls back to Pollinations.ai if no API key is provided. Use this when the user requests image creation or visual content generation.`,
  inputSchema: z.object({
    mode: z
      .enum(["create"])
      .optional()
      .default("create")
      .describe("Image generation mode - currently only supports 'create'"),
  }),
  execute: async ({ mode }, { messages, abortSignal }) => {
    try {
      // Get latest messages for context
      const latestMessages = messages
        .slice(-6)
        .filter((v) => Boolean(v?.content?.length)) as ModelMessage[];

      // Extract prompt from messages
      let prompt = "";
      for (const msg of latestMessages.reverse()) {
        if (msg.role === "user" && typeof msg.content === "string") {
          prompt = msg.content;
          break;
        }
      }

      if (!prompt) {
        prompt = "Create a beautiful image";
      }

      const images = await generateImageWithHuggingFace({
        prompt,
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

      const modelName = process.env.HUGGINGFACE_API_KEY 
        ? "stable-diffusion (HuggingFace FREE)" 
        : "pollinations-ai (FREE fallback)";

      return {
        images: resultImages,
        mode,
        model: modelName,
      };
    } catch (e) {
      logger.error(e);
      throw e;
    }
  },
});
