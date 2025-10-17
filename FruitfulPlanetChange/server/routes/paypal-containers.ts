
import { Request, Response } from "express";

export async function getPaypalContainers(req: Request, res: Response) {
  try {
    // Validate HTTP method
    if (req.method !== 'GET') {
      return res.status(405).json({ error: "Method not allowed. Use GET." });
    }

    // Return active PayPal container configurations
    const containers = [
      {
        id: "claimroot-codeflow-technology",
        hostedButtonId: "K9BPET82JDRQ4",
        name: "ClaimRoot License - CodeFlow (Technology)",
        price: "$1140.00 USD",
        status: "active",
        containerElement: "paypal-container-K9BPET82JDRQ4"
      }
    ];

    res.json({
      containers,
      status: "active",
      message: "PayPal containers loaded successfully"
    });
  } catch (error) {
    console.error("Failed to load PayPal containers:", error);
    res.status(500).json({ 
      error: "Failed to load PayPal containers",
      containers: []
    });
  }
}
