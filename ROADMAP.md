#Roadmap
Here is the official project roadmap.

### Next Release
- [Switch to React](#switch-to-react)

### Release + 1
- [Notes](#notes)

### Future
- [Upgraded Tasks](#upgraded-tasks)
- [Event Module](#event-module)
- [Customizable Lists](#customizable-lists)
- [Social APIs](#social-apis)
- [Native Clients](#native-clients)
- [Reminders & Notifications](#reminders--notifications)
- [Daily Scheduling](#daily-scheduling)
- [Analysis & Prediction](#analysis--prediction)
- [Projects & Collaborative Lists](#projects--collaborative-lists)
- [Chat Communication](#chat-communication)
- [File Sharing](#file-sharing)
- [Collaborative Editing](#collaborative-editing)
- [Continuous Integration](#continuous-integration)

## Descriptions

### Switch to React
Moving from AngularJS to ReactJS single-page application. No technical reasons really. I just kind of want to build something with ReactJS.

### Notes
A Notes module to allow the user to jot down important thoughts and ideas for tasks quickly and easily.

### Upgraded Tasks
The new Tasks module will allow users to build more complex, multi-staged tasks with dependencies and sub-tasks. You can also add a text description to store details about each task.

### Event Module
The Event module will allow users to set special one-time tasks with a set timespan. This will allow them to mark off certain blocks of time for meetings, appointments, and so forth. The Events will tie into our Notification module to remind the user of upcoming events.

### Customizable Lists
Customizable Lists will allow users to develop configurable sets of tasks lists which can be maintained separate from their primary task list. These can repeat on a regular basis (ie. daily routines) or serve as checklists for regular tasks and procedures (ie. Steps to Pushing to Production).

### Social APIs
I'm looking to incorporate a few social APIs for two purposes. One is social authentication, easing the user's path to creating a new account. But also to incorporate other services into our framework.
- GitHub
  - Issues -> Tasks
  - Milestones -> Events
- Google
  - Calender Events -> Events
- Facebook
  - Events -> Events
- Trello
  - Cards -> Tasks


### Native Clients
Eventually I want to port the application to native applications, allowing for more robust integration with mobile devices. At that point we can provide extended location support.

### Reminders & Notifications
We want all of our tasks and events to be linked to a robust, customizable notification system. Until we get native clients, this means email and text message notifications. Eventually we hope to provide mobile push notifications as well.

### Daily Scheduling
With the Event system in place, we'll eventually be able to use that information to construct daily schedules to suggest blocks of time during which to tackle various Tasks, accounting for any planned Events automatically.

### Analysis & Prediction
By analyzing your patterns of completion and priority on similarly tagged Tasks, Ari will predict the priority of events without having to assign them. Then, upon request, she can generate a new Active task lists featuring the tasks that matter most to you.

### Projects & Collaborative Lists
We hope to connect you with your coworkers and partners to increase your productivity. With Projects, multiple users can share common Task lists and even delegate Tasks to one another.

### Chat Communication
Maybe a Chat System? Who Knows.

### File Sharing
A business/organization feature. Allow users within an organization to share/sync files through the app.

### Collaborative Editing
Tied to [File Sharing](#file-sharing). Allow users to concurrently editing documents through the application in real-time, allowing them to collaborate in tandem while communicating (externally).

### Continuous Integration
CI should be implemented into the application. The current deployment process is too much for me and I would like to learn about how CI is done.
