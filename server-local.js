import app from './api/server.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Server is running locally on http://localhost:${PORT}`);
});