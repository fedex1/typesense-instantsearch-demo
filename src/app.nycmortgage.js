/* global instantsearch */
/*
{
    "Block": "1158",
    "Borough": "MANHATTAN",
    "CRFN": "2024000072710",
    "Doc Amount": "216000000",
    "Doc Date": "2024-03-21",
    "Lot": "1701",
    "Pages": 31,
    "Partial": "ENTIRE LOT",
    "Party1": "200 WEST 67TH ST OWNER, L.L.C.",
    "Party2": "MF1 CAPITAL LLC",
    "Recorded / Filed": "3/22/2024 12:47:42 PM",
    "id": "1011581701-2024000072710",
    "propertyid": 1011581701,
    "updated": 1710993600000,
    "objectID": "1011581701-2024000072710",
    "_snippetResult": {
        "Block": {
            "value": "1158",
            "matchLevel": "none",
            "matchedWords": []
        },
        "Borough": {
            "value": "MANHATTAN",
            "matchLevel": "none",
            "matchedWords": []
        },
        "CRFN": {
            "value": "2024000072710",
            "matchLevel": "none",
            "matchedWords": []
        },
        "Doc Amount": {
            "value": "216000000",
            "matchLevel": "none",
            "matchedWords": []
        },
        "Doc Date": {
            "value": "2024-03-21",
            "matchLevel": "none",
            "matchedWords": []
        },
        "Lot": {
            "value": "1701",
            "matchLevel": "none",
            "matchedWords": []
        },
        "Pages": {
            "value": "31",
            "matchLevel": "none",
            "matchedWords": []
        },
        "Partial": {
            "value": "ENTIRE LOT",
            "matchLevel": "none",
            "matchedWords": []
        },
        "Party1": {
            "value": "200 WEST 67TH ST OWNER, L.L.C.",
            "matchLevel": "none",
            "matchedWords": []
        },
        "Party2": {
            "value": "MF1 CAPITAL LLC",
            "matchLevel": "none",
            "matchedWords": []
        },
        "Recorded / Filed": {
            "value": "3/22/2024 12:47:42 PM",
            "matchLevel": "none",
            "matchedWords": []
        },
        "id": {
            "value": "1011581701-2024000072710",
            "matchLevel": "none",
            "matchedWords": []
        },
        "propertyid": {
            "value": "1011581701",
            "matchLevel": "none",
            "matchedWords": []
        },
        "updated": {
            "value": "1710993600000",
            "matchLevel": "none",
            "matchedWords": []
        }
    },
    "_highlightResult": {
        "Block": {
            "value": "1158",
            "matchLevel": "none",
            "matchedWords": []
        },
        "Borough": {
            "value": "MANHATTAN",
            "matchLevel": "none",
            "matchedWords": []
        },
        "CRFN": {
            "value": "2024000072710",
            "matchLevel": "none",
            "matchedWords": []
        },
        "Doc Amount": {
            "value": "216000000",
            "matchLevel": "none",
            "matchedWords": []
        },
        "Doc Date": {
            "value": "2024-03-21",
            "matchLevel": "none",
            "matchedWords": []
        },
        "Lot": {
            "value": "1701",
            "matchLevel": "none",
            "matchedWords": []
        },
        "Pages": {
            "value": "31",
            "matchLevel": "none",
            "matchedWords": []
        },
        "Partial": {
            "value": "ENTIRE LOT",
            "matchLevel": "none",
            "matchedWords": []
        },
        "Party1": {
            "value": "200 WEST 67TH ST OWNER, L.L.C.",
            "matchLevel": "none",
            "matchedWords": []
        },
        "Party2": {
            "value": "MF1 CAPITAL LLC",
            "matchLevel": "none",
            "matchedWords": []
        },
        "Recorded / Filed": {
            "value": "3/22/2024 12:47:42 PM",
            "matchLevel": "none",
            "matchedWords": []
        },
        "id": {
            "value": "1011581701-2024000072710",
            "matchLevel": "none",
            "matchedWords": []
        },
        "propertyid": {
            "value": "1011581701",
            "matchLevel": "none",
            "matchedWords": []
        },
        "updated": {
            "value": "1710993600000",
            "matchLevel": "none",
            "matchedWords": []
        }
    },
    "__position": 7,
    "__hitIndex": 6
}
*/

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
    queryBy: "Doc Date",
  },
});
const searchClient = typesenseInstantsearchAdapter.searchClient;
    const format = new Intl.NumberFormat("en-US", {
        style: "currency",
        maximumFractionDigits: 0,
        minimumFractionDigits: 0,
        currency: "USD",
    });
const index="nyc-mortgage";

const search = instantsearch({
  searchClient,
  // indexName: 'books',
  // indexName: 'algolia-store',
  indexName: index,
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
      // let text=item._highlightResult['Doc Date'].value;
      let text=item['Doc Date'];
      const LIMIT=20
      if (text.length > LIMIT) {
        text = text.substring(0, LIMIT) + '...';
      }
        return `
        <div>
          <!-- <img src="${item.image_url}" alt="${item.name}" height="100" /> -->
          <div class="hit-name">
            <a target="_blank" href="https://prop.tidalforce.org/search2/${item._highlightResult.propertyid.value}">${text}</a>
          </div>
          <div class="hit-authors">
          ${item._highlightResult.propertyid.value}
          </div>
          <div class="hit-publication-year">Recorded ${item['Recorded / Filed']}</div>
          <div class="hit-rating">Mortgage ${format.format(item['Doc Amount'])}</div>
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
      { label: "Recorded (asc)", value: `${index}/sort/recorded:asc` },
      { label: "Recorded (desc)", value: `${index}/sort/recorded:desc` },
      { label: "Date (asc)", value: `${index}/sort/updated:asc` },
      { label: "Date (desc)", value: `${index}/sort/updated:desc` },
    ],
  }),
]);

search.start();
