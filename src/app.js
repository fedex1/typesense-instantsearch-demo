/* global instantsearch */
import debounce from 'lodash.debounce';
function timeSince(date) {

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
  const sendEventDebounced = debounce(() => {
    // crazy but true leave as a for production
    // gtag('event', 'page_view', {
    a('event', 'page_view', {
      page_location: window.location.pathname + window.location.search,
    });
  }, 3000);

  return {
    onStateChange() {
      sendEventDebounced();
    },
    subscribe() {},
    unsubscribe() {},
  };
}

import { connectAutocomplete } from "instantsearch.js/es/connectors";
import TypesenseInstantSearchAdapter from 'typesense-instantsearch-adapter';

// const TYPESENSE_API_KEY = "NCF9nxUpkuuxRnRHwDOm2a1tmnzabjik";

// const TYPESENSE_API_KEY = "LlA8twqNqXHYZDUFml6sQYG16KShHCxY";
// all collection search only
// const TYPESENSE_API_KEY =  "GGvyHonOH3SQBNNhkyCLr6XnuXFJNHIw";
const TYPESENSE_API_KEY =  "PlJ5v2KJBhU3ENl8xYLbe1dT9fIanKoO"

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
    query_by: "text",
  },
});

const typesenseInstantsearchAdapterautocomplete = new TypesenseInstantSearchAdapter({
  server: {
    apiKey: TYPESENSE_API_KEY, // Be sure to use an API key that only allows searches, in production
    nodes: [
      {
                        host: "tidalforce.share.zrok.io",
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
    query_by: "_autocomplete",
    // facet_by: "ORG_AMTint",
  },
});

const searchClient = typesenseInstantsearchAdapter.searchClient;
const searchClientautocomplete = typesenseInstantsearchAdapterautocomplete.searchClient;

    const format = new Intl.NumberFormat("en-US", {
        style: "currency",
        maximumFractionDigits: 0,
        minimumFractionDigits: 0,
        currency: "USD",
    });
const index="transcripts";

const search = instantsearch({
  searchClient,
  indexName: index,
  facets: ['*'],
  routing: true,
});

search.addWidgets([
  instantsearch.widgets.searchBox({
    container: '#searchbox',
    placeholder: 'Type in a search term... ',
     autofocus: true,
    cssClasses: {
      input: 'form-control',
      loadingIcon: 'stroke-primary',
    },
  }),
  instantsearch.widgets.configure({
    hitsPerPage: 10,
  }),
   instantsearch.widgets.clearRefinements({
    container: '#clear-refinements',
  }),

    instantsearch.widgets.stats({
      container: '#stats',
    }),
    instantsearch.widgets.refinementList({
    container: '#refinement-list-videoid',
    attribute: "videoid",
    searchable: true,
    limit: 10,
    searchablePlaceholder: "Search for videoid",
    }),
    instantsearch.widgets.refinementList({
    container: '#refinement-list-source',
    attribute: "source",
    searchable: true,
    limit: 10,
    searchablePlaceholder: "Search for Source",
    }),

  instantsearch.widgets.hits({
    transformItems(items, { results }) {
    // console.log(`DEBUG: ${JSON.stringify(results)}`);
    // console.log(`DEBUG: ${JSON.stringify(results)}`);
    // console.log(`DEBUG: ${JSON.stringify(results.facet_counts)}`);
    // console.log(`DEBUG: ${typeof(results)}`);
    // .results[]|.facet_counts[]|.stats|.sum'

    // console.log('debug transform results',results);
    console.log('debug transform items', items);
    document.title = `Video search: ${results.query.substring(0,30)} | Tidalforce`;
    return items.map((item, index) => ({
      ...item,
      position: { index, page: results.page },
      stats: results.facets_stats,
      query: results.query,
    }));
  },
    container: '#hits',
    templates: {
      item(item) {
         console.log("item",item);
      try {
      // let text=item._highlightResult['Doc Date'].value;
      const textfull=item.text;
      const LIMIT2=1000;
      let text=textfull;
      const LIMIT=50
      if (text.length > LIMIT) {
        text = text.substring(0, LIMIT) + '...';
      }
          // ${JSON.stringify(item,"",3)}
          const start=parseInt(item.start||0);
        return `
        <div>
          <div class="hit-name">
            ${text}
          </div>
          <div class="hit-authors">
          <a target="_blank" href="https://youtu.be/${item.videoid}?t=${start}">Video share link</a>
          </div>
          <div class="hit-publication-year">Updated <b>${timeSince(item.lastmodINT*1000)} ago</b></div>
          <div class="hit-rating">Cache: ${item._highlightResult.text.value.substring(0,LIMIT2)}</div>
          <div class="stats">(query "${item.query}")</div>
          </div>
          <!--
          <div><pre>
           ${JSON.stringify(item,"",3)}
          </pre></div>
          -->

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
      { label: "Date (asc)", value: `${index}/sort/lastmodINT:asc` },
      { label: "Date (desc)", value: `${index}/sort/lastmodINT:desc` },
    ],
  }),
]);


search.use(googleAnalyticsMiddleware);

search.start();



