/* eslint-disable */
import Prism from 'prismjs';
import * as basicLightbox from 'basiclightbox';
import 'lazysizes';
import config from './src/utils/siteConfig'

const scrapeEndpoint = config.lambda.scrape
const userEndpoint = config.lambda.user


// Events
// -------------------------------------------
export const onClientEntry = () => {
  getUserSession() // Check user logged-in state
}

export const onRouteUpdate = ({location}) => {
  // Route detection
  let path = location.pathname;
  if ((path.split('/').length - 1) === 2) {
    codeSyntaxHighlight(); // Code syntax highlighting
    enableLightboxImages(); // Image lightboxes
  } else if (path.indexOf('author')) {
    scrapeUrlMetadata(); // Author website widget
  }
}

// -------------------------------------------
// Posts
// -------------------------------------------
function codeSyntaxHighlight() {
  Prism.plugins.NormalizeWhitespace.setDefaults({
    'remove-trailing': true,
    'remove-indent': true,
    'left-trim': true,
    'right-trim': true
  });
  Prism.highlightAll();
}

function enableLightboxImages() {
  let images = document.querySelectorAll('.kg-image-card img');
  if (images.length > 0) {
    for (let image in images) {
      if (image < images.length) {
        images[image].onclick = () => {
          let html = `<img src="` + images[image].getAttribute('src') + `" alt="` + images[image].getAttribute('alt') + `" />`;
          const instance = basicLightbox.create(html, {
            onShow: (instance) => {
              instance.element().style.opacity = 1
            },
            onClose: (instance) => {
              instance.element().style.opacity = 0
            }
          }).show()
        }
      }
    }
  }
}

// -------------------------------------------
// Authors
// -------------------------------------------
function scrapeUrlMetadata() {
  let linkElement = document.getElementById('author-website');
  if (linkElement) {
    let url = linkElement.getAttribute('href');
    let client = new HttpClient();
    client.get(scrapeEndpoint + url, function(response) {
      let data = JSON.parse(response)
      linkElement.innerHTML = '<div class="website-title">' + data['Title'] + '</div>' + '<div class="website-description">' + data['Description'] + '</div>' + '<img src="' + data['Image'] + '" alt="' + data['Title'] + '" class="website-image" />'
    });
  }
}

let HttpClient = function() {
  this.get = function(url, callback) {
    let httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function() {
      if (httpRequest.readyState == 4 && httpRequest.status == 200)
        callback(httpRequest.responseText);
      }
    httpRequest.open("GET", url, true);
    httpRequest.send(null);
  }
}

// -------------------------------------------
// Members
// -------------------------------------------
function getUserSession() {
  let client = new XMLHttpRequest();
  const sessionCookies = document.cookie;
  if (sessionCookies) {
      client.open('POST', userEndpoint, true);
      client.setRequestHeader('Content-type', 'text/plain;charset=utf-8');
      client.onload = function() {
        if (this.responseText) {
          let data = JSON.parse(this.responseText);
        }
      }
      client.send(sessionCookies);
  }
}
