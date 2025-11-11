Project: “Cooking & Recipes” — A food and recipe blog featuring easy-to-follow cooking tutorials and meal plans
Students: Bexultan Nishanbek & Almukhamedov Temirlan

1) Objectives
	•	Build a simple, user-friendly cooking website with 4 pages: Home, Recipes, Meal Plans, and About.
	•	Provide quick access to popular dishes, step-by-step recipes, and a ready-to-use weekly meal plan.
	•	Ensure responsive layout (desktop → mobile), clear navigation, and consistent visuals.
	•	Use open-license food photos from free stock sources (Unsplash/Pexels) to illustrate dishes.


2) What We Built

Pages & Features
	•	Home (index.html)
	•	Hero section with project intro.
	•	“Popular Dishes” card grid (pasta, salads, soups, breakfast, dessert) linking to anchors on the Recipes page.
	•	CTA block to the Meal Plans page.
	•	Recipes (recipes.html)
	•	Anchor-based quick navigation (Carbonara, Bolognese, Caesar, Greek, Tomato Soup, Chicken Soup, Omelette, Cheesecake).
	•	For each recipe: cover image, time/servings/difficulty, ingredients, and step-by-step instructions.
	•	Meal Plans (meal-plans.html)
	•	A 7-day weekly plan using CSS Grid (3 columns on desktop, down to 1 on mobile).
	•	Quick link back to the Recipes page.
	•	About (about.html)
	•	Project mission, feature list, illustration, and contact info.

Technical Choices
	•	Stack: pure HTML5 + CSS3 (no JS), system fonts.
	•	Design system: CSS variables in :root (colors, radii, shadows) for consistent theming.
	•	Navigation: sticky header with backdrop-filter and increased z-index.
	•	Images: open-license dish images (demo uses source.unsplash.com URLs; can be swapped to fixed Pexels/Unsplash links).
	•	Accessibility: semantic structure, adequate color contrast, alt text on all images.




3) Screenshots
  Home page
<img width="1850" height="839" alt="image" src="https://github.com/user-attachments/assets/049e880d-8192-4fc3-a0d0-2405cf1474a4" />
<img width="1889" height="950" alt="image" src="https://github.com/user-attachments/assets/5210eabe-ec80-4146-a45d-e6a6c6a7a90c" />
  Recipes page
<img width="1231" height="948" alt="image" src="https://github.com/user-attachments/assets/84c73361-d159-429f-8870-711a3bbb08a7" />
  Plans page
<img width="1294" height="947" alt="image" src="https://github.com/user-attachments/assets/2fba8381-f746-4631-a192-8e7c91c8ac2c" />
  About page
<img width="1796" height="918" alt="image" src="https://github.com/user-attachments/assets/0ba5c345-a542-4ceb-b9ee-e35668d5bde7" />

  What we used for collaborative coding


<img width="398" height="186" alt="image" src="https://github.com/user-attachments/assets/4bd4512c-0f39-4557-8ab0-fdd83698c8ee" />




4) Reflection

What went well
	•	A unified visual language via CSS variables and reusable components (cards, recipe blocks, plan grids).
	•	Clear information architecture: Home → Recipes → Meal Plan → About.
	•	Easy maintenance/extension: adding new dishes or pages is straightforward.

Challenges & solutions
	•	Sticky header “dropping” on the Recipes page: typically caused by overflow/transform on ancestors and stacking context issues.
	•	Fix: ensured no conflicting overflow/transform above the header, raised z-index, and kept a fallback option with position: fixed + body top padding if needed.
	•	Image consistency: prioritized horizontal shots with similar color temperature; used dynamic Unsplash URLs for demo and can pin exact stock URLs when finalizing.

Future improvements
	•	Filtering/searching recipes by tags (breakfast/lunch/dinner, difficulty, time).
	•	Favorites (JS + LocalStorage).
	•	Export/print the weekly plan as PDF.

**Summary: We delivered a minimalist, responsive 4-page cooking website with dish cards, detailed recipes, a weekly meal plan, and an About page. Responsibilities were split between Nishanbek Bexultan and Almukhamedov Temirlan; key risks (sticky header and image selection) were addressed.**


