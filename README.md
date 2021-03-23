# Gatsby tarter Glass

A Gatsby blog starter with glassmorphism aesthetic.

![demo site screenshot](./screenshot.png)

[View Live Demo](https://gatsbyfrostedblog.netlify.app)

## Features

Fully responsive
SEO metadata and Open Graph tags
Maximize lighthouse score
Minimalistic
Customizable via a config.js file
Easy to deploy
Statically-generated via markdown files
Server-side rendering
Syntax highlighting via PrismJS
Add Google Analytics and make it your own all with in the CMS.

## Local Install

```bash
# 1. Clone the repository
git clone https://github.com/yinkakun/gatsby-frosted-blog

# 2. Navigate into repository
cd gatsby-frosted-blog

# 3. Install the dependencies
yarn install

# 4. Start the development server
yarn start

# 5. Start the build mode
yarn  build
```

## Configuration

Within gatsby-config.js, you can specify information about your site (metadata) like the site title and description to properly generate meta tags.

```js
// gatsby-config.js

module.exports = {
  siteMetadata: {
    title: `Gatsby Frosted Blog`,
    author: {
      name: `Yinka Adedire`,
      summary: `self-taught front-end dev. jamstacked.`,
    },
    description: `A Gatsby blog theme with glassmorphism aesthetic`,
    siteUrl: `https://gatsbyfrostedblog.netlify.app/`,
    social: {
      twitter: `yinkakun`,
    },
  },

  // ...
};
```

## Manually Editing contents

### Blog Posts

Blog contents is at `content/blog`. Delete placeholder blog posts.

```
/content/blog/hello-world

---
title: Hello World
date: "2015-05-01"
description: "Hello World"
---

This top portion is the beginning of the post and will show up as the excerpt on the homepage.

# ...

```

# Editing Contents with Netlify CMS

This project is preconfigured to work with Forestry as a way to manage your content. Forestry makes changes by editing markdown or data files, uploading media to the correct directory and committing these updates to your repo directly.

Goto app.netlify.com > select your website from the list
Goto identity and Click Enable Identiy
Click on Invite Users and invite yourself. You will receive an email and you need to accept the invitation to set the password.
Now headover to Settings > Identity > Services and Enable Git Gateway
You can also manage who can register and log in to your CMS. Goto Settings > Identity > Registration >Registration Preferences. I would prefer to keep it to Invite Only, if i am the only one using it.
Now, goto to site-name.netlify.app/admin/, and login with your credentials.

Once you are in your Netlify CMS, you can navigate to Posts and Pages. Here you will find a list of existing pages and posts.

You can select any existing post or page to start editing or add a New Post. Have fun :)

There's no special setup you need to do with Netlify CMS to deploy with Netlify. When Netlify CMS makes commits to your repo, Netlify will auto-trigger a rebuild / deploy when new commits are made.

Eleventy Duo has Forestry CMS pre-configured as standard. You can customize the configuration by editing .forestry/settings.yml.

The basic CMS setup allows you to edit the following:

Home page: Edit the content on your homepage.

About page: Edit the content of your about page.

Posts: Create and edit blog posts.

Generic pages: Create generic pages that use a similar layout to posts.

## Add Google Analytics

WIP

## Deployment

Netlify is a great way to easily deploy sites.
Create a new site in Netlify and import your repository.
Set the build command to yarn build
Set the publish directory to public

## Built with

Gatsby for Static Site Generation
Netlify CMS for content management
Framer Motion for animation
Styled Component for styling

Isn't JAMStack beautiful?
