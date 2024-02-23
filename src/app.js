/* global instantsearch */

import TypesenseInstantSearchAdapter from 'typesense-instantsearch-adapter';

// const TYPESENSE_API_KEY = "NCF9nxUpkuuxRnRHwDOm2a1tmnzabjik";
const TYPESENSE_API_KEY = "LlA8twqNqXHYZDUFml6sQYG16KShHCxY";
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
                        host: "1ztriixxhgxh.share.zrok.io",
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
    queryBy: 'data.PropAddr,data.PropOwner',
  },
});
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
  indexName: 'algolia-store',
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
      let text=item._highlightResult.data.PropAddr.value;
      const LIMIT=20
      if (text.length > LIMIT) {
        text = text.substring(0, LIMIT) + '...';
      }
        return `
        <div>
          <!-- <img src="${item.image_url}" alt="${item.name}" height="100" /> -->
          <div class="hit-name">
            <a target="_blank" href="https://prop.tidalforce.org/usa/delinquent-property/${item._highlightResult.data.id.value}">${text}</a>
          </div>
          <div class="hit-authors">
          ${item._highlightResult.data.PropOwner.value}
          </div>
          <div class="hit-publication-year">${item.data.BillYear}</div>
          <div class="hit-rating">Owes ${format.format(item.data.PropOwes)}</div>
        </div>
      `;
      },
    },
  }),
  instantsearch.widgets.pagination({
    container: '#pagination',
  }),
]);

search.start();
