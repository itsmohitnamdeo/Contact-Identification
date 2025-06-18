const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.post("/identify", async (req, res) => {
  try {
    const { email, phoneNumber } = req.body;

    if (!email && !phoneNumber) {
      return res.status(400).json({ error: "At least one of email or phoneNumber must be provided." });
    }

    const all = await prisma.contact.findMany({
      where: {
        OR: [
          { email: email || undefined },
          { phoneNumber: phoneNumber || undefined }
        ]
      }
    });

    if (all.length === 0) {
      const newContact = await prisma.contact.create({
        data: {
          email,
          phoneNumber,
          linkPrecedence: 'primary'
        }
      });

      return res.status(200).json({
        contact: {
          primaryContatctId: newContact.id,
          emails: [newContact.email].filter(Boolean),
          phoneNumbers: [newContact.phoneNumber].filter(Boolean),
          secondaryContactIds: []
        }
      });
    }

    const contactIds = all.map(c => c.id);
    const linkedContacts = await prisma.contact.findMany({
      where: {
        OR: [
          { id: { in: contactIds } },
          { linkedId: { in: contactIds } }
        ]
      }
    });

    let primary = linkedContacts.find(c => c.linkPrecedence === 'primary') ||
      linkedContacts.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))[0];

    const exists = linkedContacts.some(
      c => c.email === email && c.phoneNumber === phoneNumber
    );

    if (!exists && (email || phoneNumber)) {
      await prisma.contact.create({
        data: {
          email,
          phoneNumber,
          linkedId: primary.id,
          linkPrecedence: "secondary"
        }
      });
    }

    const finalContacts = await prisma.contact.findMany({
      where: {
        OR: [
          { id: primary.id },
          { linkedId: primary.id }
        ]
      }
    });

    const emails = Array.from(new Set(finalContacts.map(c => c.email).filter(Boolean)));
    const phoneNumbers = Array.from(new Set(finalContacts.map(c => c.phoneNumber).filter(Boolean)));
    const secondaryContactIds = finalContacts
      .filter(c => c.linkPrecedence === "secondary")
      .map(c => c.id);

    res.status(200).json({
      contact: {
        primaryContatctId: primary.id,
        emails,
        phoneNumbers,
        secondaryContactIds
      }
    });

  } catch (err) {
    console.error("❌ Error in /identify:", err);
    res.status(500).json({ error: "Internal Server Error", message: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
