
# Sparly web

This project was mostly developped by [https://github.com/Evols](Baptiste Hutteau), with [https://github.com/leo-ars](Léo Arsenin) for payments and design, and [https://github.com/Louisbrlndt][Louis Brulé Naudet] for templates and design.

Sparly web is a website builder, which goal is to be as easy to use as possible, especially for people who don't have a lot of time to spend on building a website. The main target audience is small-business owners, such as shops, restaurants, cafes, and so on.

To achieve this goal, the user first selects the type of business he/she owns (shop or restaurant). Then, he/she chooses a template, which he/she fills using a form. After that, it can be published (automatically, and managed by us) on AWS!

The third party service we use are:
- AWS for hosting the websites (you can host Sparly Web basically anywhere as long as you have a NodeJS environment, but the generated websites are hosted on AWS), handling the (users) domain names, image storage, email sending, and translation for Unsplah (as Unsplash images are labeled and tagged in English, and that we targeted the French marked, we had to translate the search queries)
- Stripe for payments (let's face it, Stripe is so easy to use it kinda feels like cheating)
- MongoDB for the database (we actually used MongoDB Atlas, but you can host it basically anywhere)
- Unsplash to have access to a huge library of images, so the users can use them for their websites

Do note that the project was made by French people for French people, so the pages are written in French, with no i18n implemented.

The projet mainly consists in a backend (that uses NodeJS) and a frontend (that uses React), that you will find in their respective folders.

## Templates

As said previously, the user's websites are generated based on templates. We use the EJS templating engine, both on the frontend (to preview the website) and on the backend (to generate the HTML code of the website). See the `TEMPLATES.md` file for more details.
