import { NextResponse } from 'next/server';
import { QdrantClient } from "@qdrant/js-client-rest";
import { CohereClient } from "cohere-ai";

export async function POST(request: Request) {
  try {
    // Log incoming request
    const body = await request.json();
    console.log('Received request:', body);

    const { prompt, selectedAdTypes, files } = body;

    // Validate required fields
    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    try {
      // Initialize Cohere
      console.log('Initializing Cohere...');
      const cohere = new CohereClient({
        token: "ecAd4ey68yP6hbEy07kSevtYEFHs6J4I4itGiI9J"
      });

      // Generate embeddings
      console.log('Generating embeddings...');
      const response = await cohere.embed({
        texts: [prompt],
        model: "embed-english-v2.0",
      });
      console.log('Embeddings generated:', Array.isArray(response.embeddings) ? response.embeddings.length : 1);

      // Initialize Qdrant
      console.log('Initializing Qdrant...');
      const qdrantClient = new QdrantClient({
        url: "https://7390d518-692d-457b-a197-c8948773dafe.us-east4-0.gcp.cloud.qdrant.io",
        apiKey: "a9bsURdE3GipcpcPe594agwx-5B8ReUAj0Z5W3jFMOCJjRrLOIiR3Q",
        timeout: 15000  // Increased timeout
      });

      const embeddings = (response.embeddings as number[][])[0];

      // Check collection
      const collectionExists = await qdrantClient.getCollection("my_collection")
        .then(() => true)
        .catch(() => false);

      // Create if doesn't exist
      if (!collectionExists) {
        await qdrantClient.createCollection("my_collection", {
          vectors: {
            size: embeddings.length,
            distance: "Cosine"
          }
        });
      }

      // Upsert data
      const result = await qdrantClient.upsert("my_collection", {
        points: [{
          id: `point-${Date.now()}`,
          vector: embeddings,
          payload: { prompt, selectedAdTypes, files }
        }]
      });

      return NextResponse.json({ success: true, result });
    } catch (innerError: any) {
      console.error('Detailed error:', {
        message: innerError.message,
        stack: innerError.stack,
        response: innerError.response?.data
      });
      throw innerError;
    }

  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred' },
      { status: 500 }
    );
  }
} 