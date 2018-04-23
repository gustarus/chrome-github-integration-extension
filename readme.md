# Chrome extensions for github integration
The following settings are available in this extension:
1. [Replace tickets numbers in pull requests with links to jiira tasks](#1-replace-tickets-numbers-in-pull-requests-with-links-to-jiira-tasks).
2. [Add link to jiira task for every comment in pull requests](#2-add-link-to-jiira-task-for-every-comment-in-pull-requests).
3. [Block merge for pull requests if there is wip or \[wip\] in the title of pull request](#3-block-merge-for-pull-requests-if-there-is-wip-or-wip-in-the-title-of-pull-request).

## Change extension options
**1. Install the extension**

**2. Go to options**

Right click on the icon of the extension in the bar.


![Default pull request title](docs/images/options-1.png)


**3. Set your options**

Jiira host is required.


![Default pull request title](docs/images/options-2.png)

## Functionality
### 1. Replace tickets numbers in pull requests with links to jiira tasks
**1. Create a pull request**

Imagine that we already have a pull request.


![Default pull request title](docs/images/ticket-1.png)

**2. Add ticket number to the comment**

Let's add ticket number, for example: `TASK-1234`.
*You can take ticket number from link to the task: https://jira.example.com/browse/`TASK-1234`.*
Now we have ticket title with ticket number which is a link to the ticket in jiira.


![Add ticket number](docs/images/ticket-2.png)

### 2. Add link to jiira task for every comment in pull requests
**1. Create a branch with ticket number**

In this example it's a `feature/TASK-1234`.


![Create a branch](docs/images/comment-1.png)

**2. Create a pull request for the branch with ticket number**

Imagine that me made some changes and pushed the branch. Now we are going to create a pull request.
The link to the ticket will be set to the comment window and you can change it if you want.  


![Create a pull request](docs/images/comment-2.png)

**3. See the link to the ticket in the comment**

Now we have a pull request with link to the ticket.


![See the link](docs/images/comment-3.png)

### 3. Block merge for pull requests if there is wip or \[wip\] in the title of pull request
**1. Create a pull request***

Imagine that we already have a pull request with all passed checks.


![Default pull request title](docs/images/wip-1-1.png)

Also we have an enabled button for this merge request.


![The button is available](docs/images/wip-1-2.png)

**3. Add wip flag to the comment**

Let's add `[WIP]` flag (also available: `wip`, `[wip]`, `WIP`).


![The title was changed](docs/images/wip-2-1.png)

Now the button is blocked.


![The button is blocked](docs/images/wip-2-2.png)

