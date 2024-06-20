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
import debounce from 'lodash.debounce';

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
    query_by: "CAND_COMM_NAME,FLNG_ENT_FIRST_NAME,FLNG_ENT_MIDDLE_NAME,FLNG_ENT_LAST_NAME,FLNG_ENT_ADD1,FILING_SCHED_DESC,FLNG_ENT_ZIP,ELECTION_YEAR,TRANS_EXPLNTN,TRANS_NUMBER",
    // facet_by: "ORG_AMTint",

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
const index="nys-election-details";
const index_autocomplete="nys-election-details-autocomplete";

const search = instantsearch({
  searchClient,
  indexName: index,
  facets: ['*'],
  routing: true,
});
const suggestions = instantsearch({
  indexName: index_autocomplete,
  searchClient: searchClientautocomplete,
});

            // ${item._highlightResult.title.value}
          // ${item._highlightResult.authors.map((a) => a.value).join(', ')}
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
        // facetFilters: ["ORG_AMTint:0"],
  }),

    instantsearch.widgets.stats({
      container: '#stats',
    }),

    instantsearch.widgets.refinementList({
    container: '#refinement-list',
    attribute: "ORG_AMTint",
    searchable: true,
    limit: 10,
    searchablePlaceholder: "Search for Amounts",
//    templates: {
//      item(item) {
//         console.log("item1",item);
//         }},
     //templates: {
     //header: '<h3 class="widgettitle">Skill Level</h3>',
	// item: '<input type="checkbox" class="ais-refinement-list--checkbox" value="&nbsp; {{label}}" {{#isRefined}}checked="true"{{/isRefined}}> {{label}} <span class="ais-refinement-list--count">({{count}})</span>',
						//},
    }),

  instantsearch.widgets.hits({
    transformItems(items, { results }) {
    // console.log(`DEBUG: ${JSON.stringify(results)}`);
    // console.log(`DEBUG: ${JSON.stringify(results)}`);
    // console.log(`DEBUG: ${JSON.stringify(results.facet_counts)}`);
    // console.log(`DEBUG: ${typeof(results)}`);
    // .results[]|.facet_counts[]|.stats|.sum'

    // console.log('debug transform',results);
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
      const textfull=item.CAND_COMM_NAME;
      let text=textfull;
      const LIMIT=50
      if (text.length > LIMIT) {
        text = text.substring(0, LIMIT) + '...';
      }
      let source="";
      try {
        // source=item._highlightResult._source.value;
        source=item._source;
      } catch(e){
      }
          // ${JSON.stringify(item,"",3)}
        return `
        <div>
          <div class="hit-name">
            <!-- <a target="_blank" href="https://app.tidalforce.org/electionsearch/${textfull}">${text}</a> -->
            ${text}
          </div>
          <div class="hit-authors">
          ${format.format(item.ORG_AMT)}&nbsp;<b>zip</b>&nbsp;${item._highlightResult.FLNG_ENT_ZIP.value}&nbsp;
          <b>explanation</b>&nbsp;${item._highlightResult.TRANS_EXPLNTN.value}
          </div>
          <div class="hit-publication-year">Updated ${item.SCHED_DATE}</div>
          <div class="hit-rating">Year ${item._highlightResult.ELECTION_YEAR.value} for ${item._highlightResult.FILING_SCHED_DESC.value} <i>Id ${item._highlightResult.TRANS_NUMBER.value} Source ${source}</i></div>
          <div class="hit-rating">${item._highlightResult.FLNG_ENT_FIRST_NAME.value} ${item._highlightResult.FLNG_ENT_MIDDLE_NAME.value} ${item._highlightResult.FLNG_ENT_LAST_NAME.value} ${item._highlightResult.FLNG_ENT_ADD1.value} ${item._highlightResult.FLNG_ENT_ZIP.value}
          <div class="stats">(query "${item.query}" sum ${format.format(item.stats.ORG_AMTint.sum)} average ${format.format(item.stats.ORG_AMTint.avg)} max ${format.format(item.stats.ORG_AMTint.max)})</div>
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
      { label: "Date (asc)", value: `${index}/sort/SCHED_DATEint:asc` },
      { label: "Date (desc)", value: `${index}/sort/SCHED_DATEint:desc` },
      { label: "Amount (asc)", value: `${index}/sort/ORG_AMTint:asc` },
      { label: "Amount (desc)", value: `${index}/sort/ORG_AMTint:desc` },
    ],
  }),
]);


search.use(googleAnalyticsMiddleware);

search.start();

// ======== Autocomplete

// Helper for the render function
const renderIndexListItem = ({ hits }) => { /* console.log(hits); */
hits = hits.filter((value, index, self) =>
  index === self.findIndex((t) => (
    t._autocomplete === value._autocomplete
  ))
)
// console.log('hits',hits);

        // const text=item._autocomplete;
        // const link1 = (encodeURI(`nys-election-details[query]=${text}`));
        //     ${text} <a href="/elections?${link1}">link</a>
return `
  <ol class="autocomplete-list">
    ${hits
      .map(
        (hit) =>
          `<li class="autocomplete-list-item"><a href="/elections?${encodeURI('nys-election-details[query]='+hit._autocomplete)}">${instantsearch.highlight({
            attribute: "_autocomplete",
            //attribute: "*",
            hit,
          })}</a><!--<br>${JSON.stringify(hit)}--></li>`
      )
      .join("")}
  </ol>
`};

// Create the render function
const renderAutocomplete = (renderOptions, isFirstRender) => {
  const { indices, currentRefinement, refine, widgetParams } = renderOptions;

  if (isFirstRender) {
    const input = document.createElement("input");
    const ul = document.createElement("ul");

    input.addEventListener("input", (event) => {
      refine(event.currentTarget.value);
    });

    widgetParams.container.appendChild(input);
    widgetParams.container.appendChild(ul);
  }

  widgetParams.container.querySelector("input").value = currentRefinement;

  widgetParams.container.querySelector("ul").innerHTML = indices.map(renderIndexListItem).join("");
};

// Create the custom widget
const customAutocomplete = connectAutocomplete(renderAutocomplete);

// Instantiate the custom widget
suggestions.addWidgets([
  customAutocomplete({
    container: document.querySelector("#autocomplete"),
  }),
  /*
  instantsearch.widgets.searchBox({
    container: '#autocomplete',
    placeholder: 'Type in a search term... ',
     autofocus: true,
    cssClasses: {
      input: 'form-control',
      loadingIcon: 'stroke-primary',
    },
  }),
  instantsearch.widgets.hits({
    container: "#autocomplete",
    templates: {
      item(item) {
      try {
         // console.log("autocomplete-item",item);
         const text=item._autocomplete;
        const link1 = (encodeURI(`nys-election-details[query]=${text}`));
        return `
        <div>
          <div class="hit-name">
            ${text} <a href="/elections?${link1}">link</a>
          </div>
          </div>`;
      } catch(e) {
        //console.log(`TRACE: ${JSON.stringify(item)}`);
        console.log("item",item);
        return `<div>ISSUE2 ${e} ${JSON.stringify(item)}</div>`;
      }
        }},
        }),
        */
]);

suggestions.start();
