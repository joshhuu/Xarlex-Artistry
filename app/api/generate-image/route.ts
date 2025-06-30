import { type NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt?.trim()) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const hfToken = process.env.HF_API_TOKEN;
    if (!hfToken) {
      return NextResponse.json({ error: "Missing Hugging Face token" }, { status: 500 });
    }

    const response = await axios.post(
      "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev",
      {
        inputs: prompt,
        parameters: {
          height: 512,
          width: 512,
          guidance_scale: 3.5,
          num_inference_steps: 28,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${hfToken}`,
        },
        responseType: "arraybuffer", // crucial for image
      }
    );

    // Check if the response is actually an image or an error
    const contentType = response.headers["content-type"] || "";
    
    if (contentType.includes("application/json")) {
      // This means we got an error response, not an image
      const errorText = Buffer.from(response.data).toString();
      console.error("HF API JSON Response:", errorText);
      
      try {
        const errorJson = JSON.parse(errorText);
        if (errorJson.error) {
          console.error("HF API Error:", errorJson.error);
          return NextResponse.json({ 
            error: `Model error: ${errorJson.error}` 
          }, { status: 503 });
        }
      } catch (parseError) {
        console.error("Could not parse error response:", parseError);
      }
      
      return NextResponse.json({ error: "Model is loading or unavailable. Please try again in a moment." }, { status: 503 });
    }
    
    // Ensure we're treating this as an image
    const imageContentType = contentType.startsWith("image/") ? contentType : "image/png";
    const base64 = Buffer.from(response.data).toString("base64");
    const imageUrl = `data:${imageContentType};base64,${base64}`;

    return NextResponse.json({ imageUrl, prompt });
  } catch (error: any) {
    console.error("Error generating image:", error?.response?.data || error.message || error);
    
    // Handle specific Hugging Face API errors
    if (error?.response?.status === 503) {
      return NextResponse.json({ 
        error: "Model is currently loading. Please wait a moment and try again." 
      }, { status: 503 });
    }
    
    if (error?.response?.status === 401) {
      return NextResponse.json({ 
        error: "Invalid API token. Please check your Hugging Face configuration." 
      }, { status: 401 });
    }
    
    if (error?.response?.status === 429) {
      return NextResponse.json({ 
        error: "Rate limit exceeded. Please wait a moment before trying again." 
      }, { status: 429 });
    }
    
    return NextResponse.json({ error: "Failed to generate image. Please try again." }, { status: 500 });
  }
}
