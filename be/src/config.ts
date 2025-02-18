if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY is required');
}

export const config = {
    port: process.env.PORT || 3000,
    anthropicKey: process.env.ANTHROPIC_API_KEY,
    // Add other config values here
}; 