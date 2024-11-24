# poojitha


# Checklist for Web Application

## General Requirements

- [X] The app must be a **Single Page Application (SPA)**, with the frontend and backend fully decoupled and communicating through HTTP calls.
- [X] Focus on **functionality**; **design** is secondary.

---

## Authentication

- [X] The app should begin with a **login page**.
- [X] Use **JWT** for authentication.
- [X] The credentials should be **your first name as both the login and password** (for testing purposes).
- [ ] **Credentials** are usually stored encrypted inside the database, but for simplicity, you can **hardcode** them on the backend code.

---

## Navigation and Redirection

- [X] After logging in, users should be **redirected to the dashboard page** and not see the login page again, unless they log out.
- [ ] All pages of the SPA should include a **top menu** with links to the **Dashboard**, **Summary**, and **Reports** pages.
- [X] Add a **logout button** in the top menu.
- [X] Attempting to access the **Dashboard**, **Summary**, or **Reports** pages without logging in should **redirect users to the login page**.

---

## Dashboard

- [ ] The dashboard page must contain a **200-word summary** of the selected topic.
- [ ] Include a **reference (URL)** for the source of your content.
- [ ] Below the summary, add a paragraph describing the **technical aspects** of your project, such as the tech stack and infrastructure.

---

## Summary and Reports Pages

- [ ] The **Summary** and **Reports** pages should each include a **dynamic chart**.
- [ ] The chart content must be retrieved **asynchronously** from the backend/database via an **HTTP GET call** with a **JSON response**.
- [ ] The chart data can be **hardcoded** and should correlate with your topic.
- [ ] Use any **charting library** (e.g., **D3.js**).
- [ ] Include a **paragraph below each chart** explaining its content and source.

---

## Accessibility

- [ ] Incorporate **ADA/WCAG accessibility principles** into the frontend code as much as possible.

---

## Hosting and Deployment

- [ ] Host both the **backend** and **frontend** on the same server (box).
- [ ] Use **NGINX** or **Apache** to serve the frontend.
- [ ] The **backend** should run on port **3000**.
- [ ] The **frontend** should run on the standard HTTP port (**80**).
- [ ] The backend should operate **independently** of the frontend and respond to HTTP calls appropriately.
- [ ] You will likely need **two endpoints** - one for each chart.
- [ ] Remember to use **JWT** to validate these requests.
- [ ] Once your app is fully operational, you can work on making it **prettier**.
- [ ] Commit the entire project (backend and frontend code) to a **single GitHub repository**.
  - [ ] Do not commit **sensitive information**, like secret keys or passwords.
  - [ ] Do not include unnecessary files (e.g., **node_modules**).
  - [ ] Use **.gitignore** to manage this.
- [ ] Ensure that the app is **accessible** from any computer at any time. Verify that it remains running even after disconnecting from SSH.

---

## Content

- [ ] Search online for an **innovation/news** related to the subject defined for your project.
- [ ] Choose **one (1) random article** and take note of its **URL**, as you will need to cite it on the **Dashboard text** of your app.
- [ ] From the content of that URL, **invent two (2) possible data visualizations (charts)**.
  - [ ] If the article already contains charts, you can mimic them on your app.
- [ ] The data of those charts must be **realistic** and based on the content of that source URL.
- [ ] Use the content you found online in a few places:
  - [ ] On the **Dashboard**.
  - [ ] To drive the **charts**.
  - [ ] In the **textual explanation** under the charts.

---

## Technical Aspects

- [ ] The **backend** should be written in **Python**.
- [ ] The **frontend** should be written in **React**.
- [ ] Use **MySQL** as the database.
- [ ] Use **JWT** for authentication.
- [ ] Use **NGINX** to serve the frontend.
- [ ] Use any **charting library** (e.g., **D3.js**) for the dynamic charts.
- [ ] Use the **latest versions** of the languages and libraries you choose.
- [ ] Use **Docker** to containerize the app.
- [ ] Use **docker-compose** to manage the containers.
- [ ] Use a **bash script** to automate the deployment process.
- [ ] Use a **reverse proxy** to serve the frontend and backend.
- [ ] Use a **custom domain name**.
- [ ] Use **HTTPS**.
