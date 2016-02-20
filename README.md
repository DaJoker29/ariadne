# Ariadne
> A productivity management service

# Build Instructions

First, use [Node/NPM](https://nodejs.org/) and [Bower](http://bower.io/) to install dependencies

```
npm install && bower install
```

Next, use [Grunt](http://gruntjs.com/) to build project

```
grunt build
```
> *Default `grunt` command will build and launch `watch` server to jump straight into coding*

Finally, launch the server via [Node](https://nodejs.org/)

```
node server
```

# Change Log

## [Unreleased]

## [v1.0.0] - 2016-18-02
### Security
- Passwords are now hashed

### Changed
- Streamlined Build Process

### Added
- Auto Version Bumps

## [v0.2.4] - 2016-17-02
### Fixed
- Scheduled Archive task

### Changed
- Minor UI Tweaks

## [v0.2.3] - 2016-16-02
### Added
- Server Logging
- Project Documentation

### Changed
- Firebase => Local User Database
- Google Auth => Local Authentication (Passport)

## [v0.2.2] - 2016-14-02
### Added
- Purge Completed Tasks (Daily)

## [v0.2.1] - 2016-14-02
### Added
- Usage Instructions
- Active/Completed Counters

### Removed
- Category Lists

## [v0.2.0] - 2016-13-02
### Added
- Important & Urgent Priorities
- Completed List
- Category Lists

### Changed
- Categories => Labels
- Default Port: 3000 => 1337

## v0.1.0 - 2016-11-02
### Added
- Firebase/Google Authentication
- Task functions (Mark Complete, Mark Active, etc.)
- New Task
- Assign Category
- REST API

[Unreleased]: https://github.com/DaJoker29/ariadne/compare/v1.0.0...HEAD
[v1.0.0]: https://github.com/DaJoker29/ariadne/compare/v0.2.4...v1.0.0
[v0.2.4]: https://github.com/DaJoker29/ariadne/compare/v0.2.3...v0.2.4
[v0.2.3]: https://github.com/DaJoker29/ariadne/compare/v0.2.2...v0.2.3
[v0.2.2]: https://github.com/DaJoker29/ariadne/compare/v0.2.1...v0.2.2
[v0.2.1]: https://github.com/DaJoker29/ariadne/compare/v0.2.0...v0.2.1
[v0.2.0]: https://github.com/DaJoker29/ariadne/compare/v0.1.0...v0.2.0
