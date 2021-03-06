# Glitch Community Projects

Discover new reasons to code, remix cool and helpful projects made with Glitch.

Philosophically, a little bit `Youtube`, some `Spotify`, with a sprinkle of `app store`.

## Contributing

Please read [CONTRIBUTING.md](https://glitch.com/edit/#!/community?path=CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests to us.

Glitch employees should check out [DEPLOYING.md](https://glitch.com/edit/#!/community?path=DEPLOYING.md) for details on our deploy process.

## Getting Started

File structure

- the backend app starts at `server/server.js`
- `src/client.js` is compiled and served as /client-bundle.js
- components and their styles are in `src/components/` :-)
- view templates are powered by the .jsx files in `src/presenters/`
- stylus files like `styles/style.styl` are compiled and served directly as `build/style.css`
- Files in `public/` and `build/` are served directly
- drag in `assets`, like images or music, to add them to your project
- `src/curated/{home|pupdates}.json` contain homepage and pupdates content from our CMS
  - See [cms.glitch.me](https://cms.glitch.me) for CMS documentation

application models -> presenter -> DOM

## Script Overview

The following commands are available for use during development:

| Command           | Description                                                              |
| ----------------- | ------------------------------------------------------------------------ |
| `npm start`       | Launch the development server                                            |
| `npm run lint`    | Lint the codebase using ESLint                                           |
| `npm run cy:run`  | Run Cypress-based integration tests in the console                       |
| `npm run cy:open` | Launch the Cypress GUI for running integration tests                     |
| `npm run cy:ci`   | Auto-start a temporary dev server and run integration tests against it   |
| `npm run build`   | Perform a production build of the site and store the results in `build/` |

## Environment Variables

Set the following values in `.env` to change how the site is built and runs

| Name         | Default       | Description                                                                                |
| ------------ | ------------- | ------------------------------------------------------------------------------------------ |
| `NODE_ENV`   | `development` | Adds extra minification and compilation steps when set to `production`                     |
| `BUILD_TYPE` | `memory`      | Perform builds in `memory`, a separate `watcher` process, or use a `static` build artifact |
| `RUNNING_ON` | `production`  | Where should the site look for user and projects (see `shared/constants.js`)               |

## Built with

- [ES6](http://es6-features.org/)
- [React.js](https://reactjs.org/)
- [Stylus](http://stylus-lang.com/)
- [Node.js](https://nodejs.org/dist/latest-v8.x/docs/api/)

```
  ___     ___      ___
 {o,o}   {o.o}    {o,o}
 |)__)   |)_(|    (__(|
--"-"-----"-"------"-"--
O RLY?  YA RLY   NO WAI!
```

#### Remixing this project

Once you remix this project, it'll come straight to life! The only external dependency that doesn't remix cleanly is OAuth login -- see the [FAQ](https://glitch.com/edit/#!/community?path=FAQ.md) for a workaround.
