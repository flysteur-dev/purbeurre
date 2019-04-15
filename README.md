<p align="center">
	<a href="https://flysteur-dev.github.io/purbeurre/" rel="noopener" target="_blank">
		<img width="150" src="https://raw.githubusercontent.com/flysteur-dev/purbeurre/master/public/icon.png" alt="PurBeurre logo">
	</a>
</p>

<h1 align="center">PurBeurre</h1>

## Demo

[Try it](https://flysteur-dev.github.io/purbeurre/) with your mobile phone.<br>
Want to keep it ? add it to your dashboard !

## Screenshots

<p align="center">
	<img src="https://raw.githubusercontent.com/flysteur-dev/purbeurre/master/public/1.png" width="250px" alt="splashscreen">
	<img src="https://raw.githubusercontent.com/flysteur-dev/purbeurre/master/public/2.png" width="250px" alt="recipes list">
	<img src="https://raw.githubusercontent.com/flysteur-dev/purbeurre/master/public/3.png" width="250px" alt="add recipe">
</p>

## Why ?

Pur Beurre is a Cook book search engine.<br>

I have so many cook books in my library! Each time I want to cook leeks, it's impossible to remember each recipe owning this ingredient.. So I end up doing usual recipes.<br>

So I decided to create PurBeurre, to take the most of my books and reinvente my cooking time.<br>

Bon appétit !<br>

## Tech

This project is using PWA (Progressive Web App) capabilities.<br>
Building for offline first, data is stored into the local storage. (data won't be deleted even if the PWA is deleted from the dashboard)

App state and data are managed by the Apollo local state, and accessible through clients queries and mutations handled by our clients resolvers.<br>
Data are restored asynchronously on startup and persisted at every modification.

Libraries:
- React
- Apollo
- GraphQL

## Try it

```sh
// Clone
git clone git@github.com:flysteur-dev/purbeurre.git

// Install
cd purbeurre
npm install

// Run
npm start
open http://localhost:3000
```

## Changelog
[0.2.0] - 2019-04-15
- Recipe validation
- Recipe tests

[0.1.0] - 2019-03-29
- Initial release

## Contributing

If you find this project useful, we'd appreciate any contribution!<br>
You can also check [project page](https://github.com/flysteur-dev/purbeurre/projects/3) to find something to start.
