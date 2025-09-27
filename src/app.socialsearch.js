/* global instantsearch */
// {"first_name":"Crystal","last_name":"Devitt","addresses":{},"gender":"female","age":46,"birth_date":"1977-11-25","email":"monchiquita@gmail.com","name":"Crystal Devitt"}

import TypesenseInstantSearchAdapter from 'typesense-instantsearch-adapter';
import debounce from 'lodash.debounce';

function timeSince(date) {
    // console.log(`date: ${date}`)
    date *= 1000
  var seconds = Math.floor((Date.now() - date) / 1000);

  var interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + " years";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes";
  }
  return Math.floor(seconds) + " seconds";
}

function googleAnalyticsMiddleware() {
   let timer;
/*
    const sendEventDebounced = debounce(() => {
        // crazy but true leave as a for production
        // gtag('event', 'page_view', {
        a('event', 'page_view', {
            page_location: window.location.pathname + window.location.search,
        });
    }, 3000);
    */

const sendEventDebounced = () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          // Send a page_view event to Google Analytics
          a('event', 'page_view', {
            page_location: window.location.pathname + window.location.search,
          });
          // You can also send custom events for search queries or results
          // For example:
           a('event', 'search', {
             // search_term: instantsearch.helper.state.query,
             event_category: 'Typesense Search',
             event_label: 'Search Query',
           });
        }, 3000); // Debounce the event to avoid excessive hits
      };

    return {
        onStateChange() {
            sendEventDebounced();
        },
        subscribe() {},
        unsubscribe() {},
    };
}

// const TYPESENSE_API_KEY = "NCF9nxUpkuuxRnRHwDOm2a1tmnzabjik";

// const TYPESENSE_API_KEY = "LlA8twqNqXHYZDUFml6sQYG16KShHCxY";
// all collection search only
// const TYPESENSE_API_KEY =  "x7nAh5dmQe4Rb3LVX0Jc0YGZDIEha4yg" // cloud
const TYPESENSE_API_KEY =  "nWWQnzGThboepoIIy3uP6J2h28R6sVai" // localhost

const typesenseInstantsearchAdapter = new TypesenseInstantSearchAdapter({
  server: {
    apiKey: TYPESENSE_API_KEY, // Be sure to use an API key that only allows searches, in production
    nodes: [
      {
      /*
        host: 'localhost',
        port: '8108',
        protocol: 'http',
        */
                        // host: "1ztriixxhgxh.share.zrok.io",
                        // host: "8iv15rppo02e.share.zrok.io",
                        host: "tidalforce.share.zrok.io",
// host: "s68pi2uqba0fhj4rp-1.a1.typesense.net",
                        port: "443",
                        protocol: "https",
      },
    ],
  },
  // The following parameters are directly passed to Typesense's search API endpoint.
  //  So you can pass any parameters supported by the search endpoint below.
  //  queryBy is required.
  //  filterBy is managed and overridden by InstantSearch.js. To set it, you want to use one of the filter widgets like refinementList or use the `configure` widget.
  additionalSearchParameters: {
    // queryBy: 'title,authors',
    // queryBy: 'data.PropAddr,data.PropOwner',
    // queryBy: "data.searchkey, data.id, data.BillYear, data.PropAddr, data.PropAssessed, data.PropOwes, data.PropOwner, data.description, data.eventid",
    query_by: "text,author",
  },
});
const searchClient = typesenseInstantsearchAdapter.searchClient;
    const format = new Intl.NumberFormat("en-US", {
        style: "currency",
        maximumFractionDigits: 0,
        minimumFractionDigits: 0,
        currency: "USD",
    });
const index="twitter-history";

const search = instantsearch({
  searchClient,
  // indexName: 'books',
  // indexName: 'algolia-store',
  indexName: index,
  routing: true,
});

            // ${item._highlightResult.title.value}
          // ${item._highlightResult.authors.map((a) => a.value).join(', ')}
search.addWidgets([
  instantsearch.widgets.searchBox({
    container: '#searchbox',
  }),
  instantsearch.widgets.configure({
    hitsPerPage: 10,
  }),
    instantsearch.widgets.stats({
      container: '#stats',
    }),
     instantsearch.widgets.refinementList({
     container: '#refinement-list-author',
     attribute: "author",
     searchable: true,
     limit: 10,
     searchablePlaceholder: "Search for Author",
     }),
  instantsearch.widgets.hits({
        transformItems(items, {
            results
        }) {
            // console.log('debug transform items', items);
            // console.log('debug transform results', results);
            document.title = `Social search: ${results.query.substring(0,30)} | Tidalforce`;
            return items.map((item, index) => ({
                ...item,
                position: {
                    index,
                    page: results.page
                },
                stats: results.facets_stats,
                query: results.query,
            }));
        },
    container: '#hits',
    templates: {
      item(item) {
        // console.log("item",item);
      try {
      // let text=item._highlightResult['Doc Date'].value;
      let text=item.text;
      const LIMIT=20
      if (text.length > LIMIT) {
        text = text.substring(0, LIMIT) + '...';
      }
      let imagesrc=`https://unavatar.io/x/${item.author}`
      if (item.author=="ZohranKMamdani"){
      imagesrc=`/images/${item.author}.jpg`
      }
          // <!-- <img src="${item.image_url}" alt="${item.id}" height="100" /> -->
          // <div class="hit-publication-year">Updated <b>${timeSince(item.changedint)} ago</b> ${item.changed}</div>
          // <div class="hit-rating">Age ${item.profile.age} for ${item._highlightResult.text.value}</div>
        return `
        <div>
          <div class="hit-name">
            <a target="_blank" href="${item.id}">${text}</a>
          </div>
          <div class="hit-authors">
           <div class="hit-rating">${item._highlightResult.text.value}</div>
           <div class="hit-rating">${item._highlightResult.author.value} <img width="50" src="${imagesrc}"></div>
           <div class="hit-publication-year">Created <b>${timeSince(item.createdINT)} ago</b> ${item.created_at}</div>
          </div>
        </div>
      `;
      } catch(e) {
        //console.log(`TRACE: ${JSON.stringify(item)}`);
        console.log("item",item);
        return `<div>ISSUE ${e} ${JSON.stringify(item)}</div>`;
      }
      }
      ,
    },
  }),
  instantsearch.widgets.pagination({
    container: '#pagination',
  }),
  instantsearch.widgets.sortBy({
    container: '#sort-by',
       items: [
      { label: "Date (asc)", value: `${index}/sort/createdINT:asc` },
      { label: "Date (desc)", value: `${index}/sort/createdINT:desc` },
    ],
  }),
]);

search.use(googleAnalyticsMiddleware);

window.onerror = function(message, file, line, col, error) {
    alert("Error occurred: " + error.message + ". that's all we know. Please wait 5 minutes before retrying. Or contact ralph@brooklynmarathon.com for a subscription.");
    return false;
};
window.addEventListener('unhandledrejection', function(e) {
    alert("Error occurred: " + e.reason.message  + ". that's all we know. Please wait 5 minutes before retrying. Or contact ralph@brooklynmarathon.com for a subscription.");
})
try {
/*
search.on('render', (renderOptions) => {
  const query = renderOptions.results.query;
  const pageTitle = query ? `Search for "${query}" | Tidalforce` : `Social Search | Tidalforce`;
  document.title = pageTitle;
});
*/
    search.start();
} catch (e) {
    console.log(e)
    alert("Error occurred: " + e  + ". that's all we know. Please wait 5 minutes before retrying. Or contact ralph@brooklynmarathon.com for a subscription.");
}
