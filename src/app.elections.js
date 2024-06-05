/* global instantsearch */
/* [
  {
    "FILER_ID": true,
    "FILER_PREVIOUS_ID": "A82861",
    "CAND_COMM_NAME": "Anna Lewis For State Senate",
    "ELECTION_YEAR": 2010,
    "ELECTION_TYPE": "State/Local",
    "COUNTY_DESC": null,
    "FILING_ABBREV": "A",
    "FILING_DESC": "32-Day Pre-Primary",
    "R_AMEND": false,
    "FILING_CAT_DESC": "Itemized",
    "FILING_SCHED_ABBREV": "A",
    "FILING_SCHED_DESC": "Monetary Contributions Received From Ind. & Part.",
    "LOAN_LIB_NUMBER": null,
    "TRANS_NUMBER": 8476853,
    "TRANS_MAPPING": null,
    "SCHED_DATE": "2010-08-11T00:00:00",
    "ORG_DATE": null,
    "CNTRBR_TYPE_DESC": "Individual",
    "CNTRBN_TYPE_DESC": null,
    "TRANSFER_TYPE_DESC": null,
    "RECEIPT_TYPE_DESC": null,
    "RECEIPT_CODE_DESC": null,
    "PURPOSE_CODE_DESC": null,
    "R_SUBCONTRACTOR": null,
    "FLNG_ENT_NAME": null,
    "FLNG_ENT_FIRST_NAME": "Lawrence",
    "FLNG_ENT_MIDDLE_NAME": null,
    "FLNG_ENT_LAST_NAME": "Yannuzzi Md",
    "FLNG_ENT_ADD1": "460 Park Avenue 5th Floor",
    "FLNG_ENT_CITY": "New York",
    "FLNG_ENT_STATE": "NY",
    "FLNG_ENT_ZIP": 10022,
    "FLNG_ENT_COUNTRY": "United States",
    "PAYMENT_TYPE_DESC": "Check",
    "PAY_NUMBER": 2930,
    "OWED_AMT": null,
    "ORG_AMT": 500,
    "LOAN_OTHER_DESC": null,
    "TRANS_EXPLNTN": null,
    "R_ITEMIZED": true,
    "R_LIABILITY": null,
    "ELECTION_YEAR_R": null,
    "OFFICE_DESC": null,
    "DISTRICT": null,
    "DIST_OFF_CAND_BAL_PROP": null
  }
]
*/
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
    query_by: "CAND_COMM_NAME,FLNG_ENT_FIRST_NAME,FLNG_ENT_MIDDLE_NAME,FLNG_ENT_LAST_NAME,FLNG_ENT_ADD1",
  },
});
const searchClient = typesenseInstantsearchAdapter.searchClient;
    const format = new Intl.NumberFormat("en-US", {
        style: "currency",
        maximumFractionDigits: 0,
        minimumFractionDigits: 0,
        currency: "USD",
    });
const index="nys-election-details";

const search = instantsearch({
  searchClient,
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
        // console.log("item",item);
      try {
      // let text=item._highlightResult['Doc Date'].value;
      const textfull=item.CAND_COMM_NAME;
      let text=textfull;
      const LIMIT=30
      if (text.length > LIMIT) {
        text = text.substring(0, LIMIT) + '...';
      }
          // ${JSON.stringify(item,"",3)}
        return `
        <div>
          <div class="hit-name">
            <a target="_blank" href="https://prop.tidalforce.org/electionsearch/${textfull}">${text}</a>
          </div>
          <div class="hit-authors">
          ${format.format(item.ORG_AMT)} zip ${item.FLNG_ENT_ZIP}
          </div>
          <div class="hit-publication-year">Updated ${item.SCHED_DATE}</div>
          <div class="hit-rating">Year ${item.ELECTION_YEAR} for ${item._highlightResult.FILING_SCHED_DESC.value}</div>
          <div class="hit-rating">${item.FLNG_ENT_FIRST_NAME} ${item.FLNG_ENT_MIDDLE_NAME} ${item.FLNG_ENT_LAST_NAME} ${item.FLNG_ENT_ADD1}
          </div>
          <div><pre>
           ${JSON.stringify(item,"",3)}
          </pre></div>

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
      { label: "Date (asc)", value: `${index}/sort/SCHED_DATEint:asc` },
      { label: "Date (desc)", value: `${index}/sort/SCHED_DATEint:desc` },
      { label: "Amount (asc)", value: `${index}/sort/ORG_AMTint:asc` },
      { label: "Amount (desc)", value: `${index}/sort/ORG_AMTint:desc` },
    ],
  }),
]);

search.start();
