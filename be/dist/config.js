"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY is required');
}
exports.config = {
    port: process.env.PORT || 3000,
    anthropicKey: process.env.ANTHROPIC_API_KEY,
    // Add other config values here
};
