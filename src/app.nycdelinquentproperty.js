/* global instantsearch */

import TypesenseInstantSearchAdapter from 'typesense-instantsearch-adapter';

// const TYPESENSE_API_KEY = "NCF9nxUpkuuxRnRHwDOm2a1tmnzabjik";
// const TYPESENSE_API_KEY = "LlA8twqNqXHYZDUFml6sQYG16KShHCxY";
const TYPESENSE_API_KEY = "7slc7YqPHBrLleUWTZiHWdsfizIfAO90";
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
    // queryBy: 'title,authors',
    // queryBy: 'data.PropAddr,data.PropOwner',
    queryBy: "all.data.searchkey, all.data.id, all.data.BillYear, all.data.PropAddr, all.data.PropAssessed, all.data.PropOwes, all.data.PropOwner, all.data.description, all.data.eventid",
  },
});
// const index = "algolia-store";
const index = "nycdelinquentproperty";
const searchClient = typesenseInstantsearchAdapter.searchClient;
    const format = new Intl.NumberFormat("en-US", {
        style: "currency",
        maximumFractionDigits: 0,
        minimumFractionDigits: 0,
        currency: "USD",
    });

const search = instantsearch({
  searchClient,
  // indexName: 'books',
  indexName: `${index}`,
  routing: true,
});

            // ${item._highlightResult.title.value}
          // ${item._highlightResult.authors.map((a) => a.value).join(', ')}
search.addWidgets([
  instantsearch.widgets.searchBox({
    container: '#searchbox',
  }),
  instantsearch.widgets.configure({
    hitsPerPage: 8,
  }),
  instantsearch.widgets.hits({
    container: '#hits',
    templates: {
      item(item) {
      try {
      // let text=item._highlightResult.data.PropAddr.value;
      let text=item.all.data.PropAddr;
      const LIMIT=20
      if (text.length > LIMIT) {
        text = text.substring(0, LIMIT) + '...';
      }
        return `
        <div>
          <!-- <img src="${item.image_url}" alt="${item.name}" height="100" /> -->
          <div class="hit-name">
            <a target="_blank" href="https://app.tidalforce.org/usa/delinquent-property/${item._highlightResult.all.data.id.value}">${text}</a>
          </div>
          <div class="hit-authors">
          ${item._highlightResult.all.data.PropOwner?item._highlightResult.all.data.PropOwner.value:"no-owner"}
          </div>
          <div class="hit-publication-year">${item.all.data.BillYear}</div>
          <div class="hit-rating">Owes ${format.format(item.all.data.PropOwes)}</div>
        </div>
      `;
      } catch(e) {
        return `<div>ISSUE ${e} ${JSON.stringify(item.data)}</div>`;
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
            {
                label: "Owes (asc)",
                value: `${index}/sort/PropOwesNUM:asc`
            },
            {
                label: "Owes (desc)",
                value: `${index}/sort/PropOwesNUM:desc`
            },
        ],
    }),
]);

search.start();
