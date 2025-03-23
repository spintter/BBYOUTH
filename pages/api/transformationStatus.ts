import type { NextApiRequest, NextApiResponse } from 'next';

// Import the shared store (in a real app, this would be a database)
import { transformationStore } from './triggerTransformation';

// Define response type
type StatusResponse = {
  active: boolean;
  lastTriggered: Date | null;
  id: string;
  message: string;
};

/**
 * API route to check the current status of the pawn-to-queen transformation
 * This allows components to sync with the transformation state
 */
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<StatusResponse>
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      active: false, 
      lastTriggered: null,
      id: '',
      message: 'Method not allowed. Please use GET.' 
    });
  }

  try {
    // Return current transformation state
    return res.status(200).json({
      active: transformationStore.active,
      lastTriggered: transformationStore.lastTriggered,
      id: transformationStore.id,
      message: transformationStore.active 
        ? 'Transformation is active' 
        : 'No active transformation',
    });
  } catch (error) {
    console.error('Status check error:', error);
    return res.status(500).json({
      active: false,
      lastTriggered: null,
      id: '',
      message: 'Failed to check transformation status',
    });
  }
} 