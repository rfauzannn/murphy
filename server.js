
require("dotenv").config();

const express = require("express");
const path = require("path");

const app = express();

app.use(express.static(path.join(__dirname, "public")));

app.get("/api/member-count", async (req, res) => {
    try {
        const token = process.env.DISCORD_BOT_TOKEN;
        const guildId = process.env.DISCORD_GUILD_ID;

        if (!token || !guildId) {
            return res.status(500).json({
                error: "Environment variables belum dikonfigurasi"
            });
        }

        const response = await fetch(
            `https://discord.com/api/v10/guilds/${guildId}?with_counts=true`,
            {
                headers: {
                    Authorization: `Bot ${token}`
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.error("Discord API error:", response.status);

            return res.status(502).json({
                error: "Gagal mengambil jumlah member dari Discord"
            });
        }

        res.json({
            memberCount: data.approximate_member_count ?? null
        });
    } catch (error) {
        console.error("Member count error:", error.message);

        res.status(500).json({
            error: "Terjadi kesalahan pada server"
        });
    }
});

app.get("/health", (req, res) => {
    res.json({ status: "ok" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Murphy server berjalan pada port ${PORT}`);
});
