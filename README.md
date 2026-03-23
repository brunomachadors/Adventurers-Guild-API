# 🐉 Adventurers Guild API

A fantasy-themed REST API built to teach backend testing, API automation, and quality engineering practices through a playful RPG scenario inspired by tabletop adventures.

---

## ⚔️ Project Purpose

The main goal of this project is to provide a realistic backend system that students can interact with while learning:

- API testing fundamentals
- Backend quality validation
- Test automation
- API documentation
- Contract validation
- Response structure validation
- Error handling validation
- CI-ready test execution

---

## 🧙 Concept

The world revolves around a **Guild of Adventurers**, where characters possess classic RPG attributes:

| Attribute | Meaning                                  |
| --------- | ---------------------------------------- |
| STR       | Strength – Physical power                |
| DEX       | Dexterity – Agility and reflexes         |
| CON       | Constitution – Endurance and resilience  |
| INT       | Intelligence – Reasoning and knowledge   |
| WIS       | Wisdom – Awareness and perception        |
| CHA       | Charisma – Influence and social presence |

---

## 🌍 Live API

Production API hosted on Vercel:

```

[https://adventurers-guild-api.vercel.app](https://adventurers-guild-api.vercel.app)

```

Example endpoint:

```

GET /api/attributes

```

Full endpoint example:

```

[https://adventurers-guild-api.vercel.app/api/attributes](https://adventurers-guild-api.vercel.app/api/attributes)

```

---

## 📚 API Documentation

Interactive Swagger documentation:

```

[https://adventurers-guild-api.vercel.app/docs](https://adventurers-guild-api.vercel.app/docs)

```

The documentation allows users to:

- Explore endpoints
- Inspect request/response schemas
- Test endpoints directly from the browser
- Understand expected responses

---

## 🧩 Current Endpoints

### 📜 Attributes

#### Get all attributes

```

GET /api/attributes

```

Returns the list of RPG core attributes.

Example response:

```json
[
  {
    "id": 1,
    "name": "Strength",
    "shortname": "STR",
    "description": "Measures physical power and brute-force capability."
  }
]
```

---

## 🏗️ Project Architecture

```
adventurers-guild-api
│
├── public
│   └── openapi.yaml
│
├── src
│   ├── app
│   │   ├── api
│   │   │   └── attributes
│   │   │       └── route.ts
│   │   │
│   │   └── docs
│   │       └── page.tsx
│   │
│   ├── data
│   │   └── attributes.ts
│   │
│   └── types
│       └── attribute.ts
│
└── README.md
```

---

## 🧭 Collaboration Workflows

To keep discussions focused, this project is organized by workflow instead of by resource.

Recommended durable threads:

- API Tests
- API Evolution
- Database and Inserts
- Contract and Documentation
- Types and Domain Models
- Technical Maintenance

Detailed thread ownership rules and examples live in [docs/collaboration-workflows.md](docs/collaboration-workflows.md).

---

## 🧰 Technologies Used

- Next.js
- TypeScript
- Vercel
- OpenAPI / Swagger
- Swagger UI
- Node.js

---

## 🧪 Testing Ecosystem

This API is designed to support testing with tools such as:

- Postman
- Newman
- Playwright
- JavaScript / TypeScript

Students can practice:

- response validation
- schema validation
- automated API testing
- test scripting
- pipeline integration

---

## 🎓 Educational Context

This API is used as part of a **Backend Test Automation course**, where students progressively learn how to:

1. Understand backend concepts
2. Perform API calls
3. Write automated tests with Postman
4. Build test scripts using JavaScript
5. Automate tests using Playwright
6. Validate API responses and data structures
7. Integrate tests in CI pipelines

---

## 🚀 Running the Project Locally

Clone the repository:

```
git clone https://github.com/your-repo/adventurers-guild-api.git
```

Install dependencies:

```
npm install
```

Run the development server:

```
npm run dev
```

API:

```
http://localhost:3000/api
```

Docs:

```
http://localhost:3000/docs
```

---

## 📖 Future Features

Planned expansions include:

- Characters
- Inventory system
- Monsters
- Quests
- Equipment
- Gold economy

These features will introduce **complex business rules for testing scenarios**.

---

## ⚡ Author

Bruno Machado
Software Quality Engineer & Mentor

---

## 🛡️ License

This project is available for educational use and experimentation.
