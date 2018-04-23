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

function getData() {
  return {
    hosts: {
      jiira: document.getElementById('jiira-host').value,
    },

    modules: {
      ticket: document.getElementById('ticket-module').checked,
      link: document.getElementById('link-module').checked,
      wip: document.getElementById('wip-module').checked,
    },
  };
}

function setData(data) {
  document.getElementById('jiira-host').value = data.hosts.jiira;
  document.getElementById('ticket-module').checked = data.modules.ticket;
  document.getElementById('link-module').checked = data.modules.link;
  document.getElementById('wip-module').checked = data.modules.wip;
}

function saveData(data, callback = null) {
  chrome.storage.sync.set(data, function () {
    callback();
  });
}

function readData(callback = null) {
  chrome.storage.sync.get(defaults, function (data) {
    callback(data);
  });
}

function listen() {
  const form = document.getElementById('form');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    e.stopPropagation();

    const data = getData();
    saveData(data, function () {
      const status = document.getElementById('status');

      status.style.opacity = 1;
      status.textContent = 'Options saved';
      setTimeout(function () {
        status.style.opacity = 0;
      }, 1500);
    });
  });
}

function main() {
  readData(function (data) {
    setData(data);
    listen();
  });
}


main();

