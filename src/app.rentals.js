/* global instantsearch */
// {"first_name":"Crystal","last_name":"Devitt","addresses":{},"gender":"female","age":46,"birth_date":"1977-11-25","email":"monchiquita@gmail.com","name":"Crystal Devitt"}

import TypesenseInstantSearchAdapter from 'typesense-instantsearch-adapter';

// const TYPESENSE_API_KEY = "NCF9nxUpkuuxRnRHwDOm2a1tmnzabjik";

// const TYPESENSE_API_KEY = "LlA8twqNqXHYZDUFml6sQYG16KShHCxY";
// all collection search only
const TYPESENSE_API_KEY =  "GGvyHonOH3SQBNNhkyCLr6XnuXFJNHIw";

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
    // queryBy: "data.searchkey, data.id, data.BillYear, data.PropAddr, data.PropAssessed, data.PropOwes, data.PropOwner, data.description, data.eventid",
    query_by: "filter,snippet,loc,lastmod",
  },
});
const searchClient = typesenseInstantsearchAdapter.searchClient;
    const format = new Intl.NumberFormat("en-US", {
        style: "currency",
        maximumFractionDigits: 0,
        minimumFractionDigits: 0,
        currency: "USD",
    });
const index="rentals";

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
    container: '#refinement-list-price',
    attribute: "priceINT",
    searchable: true,
    limit: 10,
    searchablePlaceholder: "Search for Price",
    }),
    instantsearch.widgets.refinementList({
    container: '#refinement-list-beds',
    attribute: "beds",
    searchable: true,
    limit: 10,
    searchablePlaceholder: "Search for beds",
    }),
    instantsearch.widgets.refinementList({
    container: '#refinement-list-baths',
    attribute: "baths",
    searchable: true,
    limit: 10,
    searchablePlaceholder: "Search for baths",
    }),
  instantsearch.widgets.hits({
    transformItems(items, { results }) {
    console.log('debug transform items', items);
    document.title = `Rental search: ${results.query.substring(0,30)} | Tidalforce`;
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
        // console.log("item",item);
      try {
      // let text=item._highlightResult['Doc Date'].value;
      // let text=item.loc;
      let text=item.filter;
      const LIMIT=20
      if (text.length > LIMIT) {
        // text = text.substring(0, LIMIT) + '...';
        text = text.slice(-LIMIT);
      }
        return `
        <div>
          <div class="hit-name">
            <a target="_blank" href="${item.loc}">${text}</a>
          </div>
          <div class="hit-authors">
          </div>
          <div class="hit-publication-year">Updated ${item.lastmod}</div>
          <div class="hit-rating">Body ${item._highlightResult.snippet.value}</div>
          <div class="stats">(query "${item.query}" sum ${format.format(item.stats.priceINT.sum)} average ${format.format(item.stats.priceINT.avg)} max ${format.format(item.stats.priceINT.max)})</div>
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
      { label: "Date (asc)", value: `${index}/sort/lastmod:asc` },
      { label: "Date (desc)", value: `${index}/sort/lastmod:desc` },
      { label: "Price (asc)", value: `${index}/sort/priceINT:asc` },
      { label: "Price (desc)", value: `${index}/sort/priceINT:desc` },
    ],
  }),
]);

search.start();
