import type { NextApiRequest, NextApiResponse } from 'next';

// Define response type
type TransformationResponse = {
  success: boolean;
  message: string;
  transformationId?: string;
};

// Simple in-memory store for transformation state
// In a production app, this would use a database
export const transformationStore = {
  active: false,
  lastTriggered: null as Date | null,
  id: '',
};

/**
 * API route to trigger the pawn-to-queen transformation
 * This allows for programmatic control of the animation
 */
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<TransformationResponse>
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed. Please use POST.' 
    });
  }

  try {
    // Generate a unique ID for this transformation
    const transformationId = `transform_${Date.now()}`;
    
    // Update transformation state
    transformationStore.active = true;
    transformationStore.lastTriggered = new Date();
    transformationStore.id = transformationId;
    
    // Return success response
    return res.status(200).json({
      success: true,
      message: 'Transformation triggered successfully',
      transformationId,
    });
  } catch (error) {
    console.error('Transformation error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to trigger transformation',
    });
  }
} 