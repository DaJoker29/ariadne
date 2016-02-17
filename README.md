# Ariadne
> A productivity management service

# Build Instructions

First, use [Node/NPM](https://nodejs.org/) and [Bower](http://bower.io/) to install dependencies

```
npm install && bower install
```

Next, use [Grunt](http://gruntjs.com/) to build project

```
grunt prod
```
**-- or --**
```
grunt dev
```
> Production is compressed and uglified. Development is uncompressed with sourcemaps.

> *Default `grunt` command will build development version and launch `grunt watch` to jump straight into coding*

Finally, launch the server via [Node](https://nodejs.org/)

```
node server
```

# Roadmap
## Initial Release

- Tasks
  - Active List
  - Priority
  - Labels

## Next Release

- APIs
  - Social Authentication
    - Google
    - Facebook
    - Github
  - Github Assigned Issues
  - Trello Cards
- Tasks
  - Auto-Populated
  - Sub-Tasks
  - Multiple Lists
    - Routines (Repeated on a regular basis)
    - Checklists (For set procedures, such as 'deploying a new release'
  - Task Dependencies
  - Collaborative Projects
    - Shared Lists
    - Task Delegation
- Events
  - SMS/Push Notifications
  - Reminders
  - Google Calendar
  - Facebook Events

## Future

  - Goal Monitoring
  - Daily Planning
  - Task Analysis and Prediction
  - Automated Priority

# Change Log

## [Unreleased]

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

[Unreleased]: https://github.com/DaJoker29/ariadne/compare/v0.2.3...HEAD
[v0.2.3]: https://github.com/DaJoker29/ariadne/compare/v0.2.2...v0.2.3
[v0.2.2]: https://github.com/DaJoker29/ariadne/compare/v0.2.1...v0.2.2
[v0.2.1]: https://github.com/DaJoker29/ariadne/compare/v0.2.0...v0.2.1
[v0.2.0]: https://github.com/DaJoker29/ariadne/compare/v0.1.0...v0.2.0
