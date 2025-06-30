import { type NextRequest, NextResponse } from "next/server";

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

    // Try to make the request
    const response = await fetch("https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${hfToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          height: 512,
          width: 512,
          guidance_scale: 3.5,
          num_inference_steps: 28,
        },
      }),
    });

    // Check the response content type
    const contentType = response.headers.get("content-type") || "";
    console.log("Response status:", response.status);
    console.log("Response content-type:", contentType);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("HF API Error Response:", errorText);
      
      if (response.status === 503) {
        return NextResponse.json({ 
          error: "Model is loading. Please wait 10-20 seconds and try again." 
        }, { status: 503 });
      }
      
      return NextResponse.json({ 
        error: `API Error: ${errorText}` 
      }, { status: response.status });
    }

    // Check if we got JSON (error) or binary data (image)
    if (contentType.includes("application/json")) {
      const errorData = await response.json();
      console.error("HF API returned JSON:", errorData);
      return NextResponse.json({ 
        error: errorData.error || "Model returned an error response" 
      }, { status: 503 });
    }

    // Get the image data
    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const imageContentType = contentType.startsWith("image/") ? contentType : "image/png";
    const imageUrl = `data:${imageContentType};base64,${base64}`;

    return NextResponse.json({ imageUrl, prompt });
    
  } catch (error: any) {
    console.error("Error generating image:", error);
    return NextResponse.json({ 
      error: "Failed to generate image. Please try again." 
    }, { status: 500 });
  }
}
