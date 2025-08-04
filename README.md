# 🍽️ Food Knowledge Graph Recipe Search App

This is the official repository for my Capstone Project at Ashoka University. It is a full-stack web application that allows users to query a **food knowledge graph** (ontology of 16,500+ recipes) by name or by detailed parameters such as ingredients, preparation time, allergens, and more. The aim was to make rich semantic data accessible through a friendly and intuitive UI — enabling non-technical users to benefit from ontological structures in real-world use cases.

---

## 🧠 Motivation and Background

Knowledge graphs (KGs) are increasingly used across industries to represent structured relationships between concepts. In the culinary domain, a KG can model the relationships between recipes, ingredients, dietary restrictions, cuisines, cooking times, and more.

This project builds on top of a food knowledge graph (FKG) curated over 1.5 years by interns and researchers. The main challenge was to bring this static ontology to life — allowing for **dynamic querying** through a **responsive UI** while leveraging the semantic structure of OWL ontologies for rich, flexible searches.

---

## ✨ Features

- 🔍 **Search by Name**: Enter the name (or part of it) of a recipe. Fuzzy matching helps with minor typos and variations (e.g., "biryani" vs "biriyani").
- 🧩 **Search by Parameters**: Choose ingredients, max prep time, calorie constraints, allergies to exclude, and more.
- ⚙️ **Ontology-powered Filtering**: Leverages the OWL-based structure to conduct deep reasoning over hierarchical data.
- 📱 **Responsive UI**: Designed for both desktop and mobile devices using TailwindCSS.
- 🔁 **Caching and Query Optimization**: Smart caching for repeated queries and batch retrieval to reduce latency.
- 🌐 **Scalable Architecture**: Frontend and backend are modular, ready for deployment and future enhancements like SPARQL or NLP-based search.

---

## 🏗️ Architecture Overview

### Frontend
- **Framework**: Next.js
- **Styling**: TailwindCSS
- **Features**:
  - Dynamic query form with chip selectors, sliders, and multiselects
  - Realtime update of filtered results
  - Mobile-first design principles

### Backend
- **Language**: Python
- **Library**: `owlready2`
- **Role**:
  - Load and interface with `.owl` ontology
  - Convert user queries into semantic searches
  - Perform preprocessing (fuzzy match, normalization)
  - Return results in JSON format to frontend

---

## ⚠️ Challenges Tackled

- ✅ **Multilingual Support**: Some recipe labels were in Devanagari. Implemented Unicode support for accurate retrieval.
- ✅ **Corrupted Ontology Files**: Encountered malformed triples — handled using validation layers and safe loading mechanisms.
- ✅ **Hydration Errors in Frontend**: Next.js hydration mismatches resolved via server-side rendering and form state refactoring.
- ✅ **Partial Match Issues**: Created a fuzzy-match wrapper using Levenshtein distance for common typo tolerance.
- ✅ **Complex Filters**: Implemented hierarchical logic in filtering (e.g., excluding both "nuts" and its subtypes like "almonds").

---

## 🔮 Future Work

- 🗣️ **Natural Language Queries**: Accept free-text queries (e.g., "Show me quick vegan pasta") and convert to structured queries.
- 🧠 **SPARQL Query Layer**: Replace or augment `owlready2` with SPARQL endpoint for more flexible querying.
- 👥 **User Profiles and Saved Queries**: Allow users to register, save their dietary profiles, and bookmark queries.
- ☁️ **Deployment**: Dockerize and deploy backend + frontend to a cloud platform (Render / Railway / Vercel).

---

## 🧾 How to Run Locally

Docker has been configured and the application has been containerised. The user only needs to install docker on their system for this to run.

### Instruction 
```bash
docker compose down --volumes --remove-orphans
docker compose pull
docker compose up
```

### Ontology File
Place your `.owl` food knowledge graph file inside the backend directory or update its path inside the config.

---

## 🏫 Acknowledgements

- **Prof. Lipika Dey** – for her invaluable mentorship, technical insights, and continued support.
- **Prof. Partha Pratim Das** – for guiding the capstone program and offering logistical help.
- **Saransh Kumar Gupta** – for critical inputs, review, and access to the curated food knowledge graph.
- **Ashoka University** – for enabling this research and fostering academic freedom.
- The researchers and interns who contributed to the FKG dataset over the last 18 months.

---

## 📄 License

This project is open for academic and educational use. Please contact the author for any reuse or citations.

---

## 🙋‍♂️ Author

**Mansher Singh**  
[LinkedIn](https://linkedin.com/in/mansherius) | [GitHub](https://github.com/mansherius)

---

Feel free to fork or contribute!
