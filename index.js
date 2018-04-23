/**
 * Default module model which represents
 * each module for this extension.
 */
class Module {

  constructor(options) {
    this.options = options;

    this.init = this.init.bind(this);
    this.blur = this.blur.bind(this);
    this.handle = this.handle.bind(this);
  }

  init() {
    this.handle();

    const options = { capture: !0 };
    this._url = window.location.pathname;
    document.addEventListener('blur', this.blur, options);
  };

  blur() {
    if (this._url !== window.location.pathname) {
      this._url = window.location.pathname;
      setTimeout(this.handle, 0);
    }
  };

  handle() {
    throw new Error('You have to redefine `Module.handle` method.');
  };
}

/**
 * Listen to changes in title form and call handler.
 * Also call handler on page init.
 */
class TitleBehaviourModule extends Module {

  constructor(options) {
    super(options);

    this.titleSelector = 'span.js-issue-title';
    this.titleInputSelector = '.js-quick-submit';
    this.titleFormClass = 'js-issue-update';
  }

  handle() {
    const title = document.querySelector(this.titleSelector);
    if (!title) {
      return;
    }

    this.handleUpdate(title.innerText);

    document.addEventListener('submit', (e) => {
      const el = e.target;
      if (el.nodeName === 'FORM' && el.classList.contains(this.titleFormClass)) {
        const input = el.querySelector(this.titleInputSelector);
        this.handleUpdate(input.value);
      }
    });
  }

  handleUpdate(content) {
    throw new Error('You have to redefine `Module.handle` method.');
  }
}

/**
 * Render link to jiira task from github pull requests.
 */
class WipModule extends TitleBehaviourModule {

  constructor(options) {
    super(options);

    this.containerSelector = 'div.js-merge-pr';
    this.buttonSelector = 'button[type="submit"]';
    this.menuSelector = 'button[type="button"]';
    this.statusSelector = 'span.branch-action-icon';
  }

  handleUpdate(content) {
    console.log('content', content);
    const titleContent = content.toLowerCase().trim();
    const isWorkInProgress = titleContent.indexOf('[wip]') === 0
      || titleContent.indexOf('wip') === 0;

    const container = document.querySelector(this.containerSelector);
    const icon = container.querySelector(this.statusSelector);

    // handle global elements
    if (isWorkInProgress) {
      icon.setAttribute('style', 'background-color: #eff3f6;');
    } else {
      icon.removeAttribute('style');
    }

    // handle all buttons groups in merge request section
    const groups = Array.prototype.slice.call(container.querySelectorAll('.BtnGroup:not([role="clone"])'));
    for (const i in groups) {
      const group = groups[i];
      console.log(group);

      // create clone of the group with disabled buttons if not exists
      let clone = container.querySelector('[role="clone"][index="' + i + '"]');
      if (!clone) {
        // clone the group, hide it and insert before the group
        clone = group.cloneNode(true);
        clone.setAttribute('role', 'clone');
        clone.setAttribute('index', i);
        clone.setAttribute('style', 'display: none;');
        group.parentNode.insertBefore(clone, group.nextSibling);

        // search for the controls in the clone
        const button = clone.querySelector(this.buttonSelector);
        const menu = clone.querySelector(this.menuSelector);

        // define properties for the controls
        const buttonCloneIcon = '<g-emoji class="g-emoji" alias="warning" fallback-src="https://assets-cdn.github.com/images/icons/emoji/unicode/26a0.png" ios-version="6.0" style="font-size: 18px; line-height: 1;">⚠️</g-emoji>';

        // disable the button
        if (button) {
          button.innerHTML = buttonCloneIcon + ' Work in progress';
          button.setAttribute('disabled', 'disabled');
          button.classList.remove('btn-primary');
        }

        // disable the dropdown
        if (menu) {
          menu.setAttribute('disabled', 'disabled');
          menu.classList.remove('btn-primary');
        }
      }

      if (isWorkInProgress) {
        clone.removeAttribute('style');
        group.setAttribute('style', 'display: none;');
      } else {
        clone.setAttribute('style', 'display: none;');
        group.removeAttribute('style');
      }
    }
  };
}

/**
 * Listen to changes in pull request title
 * and append links to jiira tickets.
 */
class TitleJiiraModule extends TitleBehaviourModule {

  constructor(options) {
    super(options);

    this.titleSelector = '.js-issue-title';

    this.ticketRegex = /([A-Z]+-[0-9]+)/g;
    this.ticketRegexReplacement = '<a href="' + this.options.hosts.jiira + '/browse/$1" target="_blank">$1</a>';
  }

  handleUpdate() {
    this._attempts = 5;
    this._interval = setInterval(() => {
      console.log('interval');
      const title = document.querySelector(this.titleSelector);
      if (title && title.offsetParent !== null) {
        title.innerHTML = title.textContent
          .replace(this.ticketRegex, this.ticketRegexReplacement);

        clearInterval(this._interval);
      } else if (this._attempts <= 0) {
        clearInterval(this._interval);
      } else {
        this._attempts -= 1;
      }
    }, 500);
  };
}

class PullRequestCommentLink extends Module {

  constructor(options) {
    super(options);

    this.formSelector = 'form[action*="/pull/create"]';
  }

  handle() {
    if (!window.location.pathname.indexOf('/compare/')) {
      return;
    }

    let branch;
    const pathParts = window.location.pathname.split('...');
    branch = pathParts[pathParts.length - 1];
    if (!branch) {
      return;
    }

    let ticket;
    const match = branch.match(/([A-Z]+-[0-9]+)/);
    ticket = match ? match[1] : false;
    if (!ticket) {
      return;
    }

    const form = document.querySelector(this.formSelector);
    const textarea = form.querySelector('.js-comment-field');
    textarea.value = this.options.hosts.jiira + '/browse/' + ticket;
  }
}


function main() {
  const defaults = {
    hosts: {
      jiira: null,
    },

    modules: {
      ticket: true,
      link: true,
      wip: true,
    },
  };

  const modules = [
    { key: 'ticket', constructor: TitleJiiraModule },
    { key: 'link', constructor: PullRequestCommentLink },
    { key: 'wip', constructor: WipModule },
  ];

  chrome.storage.sync.get(defaults, function (options) {
    for (const module of modules) {
      if (options.modules[module.key]) {
        const instance = new module.constructor(options);
        instance.init();
      }
    }
  });
}

main();


