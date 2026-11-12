
async function sendWebhook() {
    const event = {
        id: "evt_001",
        type: "order.created",
        data: {
            orderId: "order_123",
            amount: 1499,
            currency: "INR"
        }
    };

    try {
        const response = await fetch(
            "http://localhost:4001/webhook",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(event)
            }
        );

        console.log("HTTP status:", response.status);
        console.log("Response:", await response.json());
    } catch (error) {
        console.error("Delivery failed:", error.message);
    }
}

sendWebhook();
