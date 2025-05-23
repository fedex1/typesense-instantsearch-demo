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
// const TYPESENSE_API_KEY =  "GGvyHonOH3SQBNNhkyCLr6XnuXFJNHIw";
// const TYPESENSE_API_KEY =  "c1b7IEAIWkAKm5OwKRNlq8h2Ac3qrULo";
const TYPESENSE_API_KEY =  "nWWQnzGThboepoIIy3uP6J2h28R6sVai"

const typesenseInstantsearchAdapter = new TypesenseInstantSearchAdapter({
  server: {
    apiKey: TYPESENSE_API_KEY, // Be sure to use an API key that only allows searches, in production
    timeoutSeconds: 10,
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
    query_by: "CAND_COMM_NAME,FLNG_ENT_FIRST_NAME,FLNG_ENT_MIDDLE_NAME,FLNG_ENT_LAST_NAME,FLNG_ENT_NAME,FLNG_ENT_ADD1,FILING_SCHED_DESC,FLNG_ENT_CITY,FLNG_ENT_ZIP,ELECTION_YEAR,TRANS_EXPLNTN,TRANS_NUMBER,SCHED_DATE,PURPOSE_CODE_DESC,TRANSFER_TYPE_DESC,EMPNAME",

    // group_by: "FLNG_ENT_ZIP",
    // sort_by:  "_group_found:desc",

    // facet_by: "ORG_AMTint",

  },
});

const typesenseInstantsearchAdapterautocomplete = new TypesenseInstantSearchAdapter({
  server: {
    apiKey: TYPESENSE_API_KEY, // Be sure to use an API key that only allows searches, in production
    timeoutSeconds: 10,
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
  // https://prop.tidalforce.org/elections?nys-election-details%5Bquery%5D=michael%20boomer
  /*
  routing: {
    // Use a custom URL structure for better SEO
    router: instantsearch.routers.history({
      createURL({ qsModule, routeState, location }) {
        const urlParts = [];
        if (routeState['nys-election-details']){
           routeState=routeState['nys-election-details']
        }
        console.log(`routeState: ${JSON.stringify(routeState)}`)
        console.log(`location: ${JSON.stringify(location)}`)

        // Handle query parameter
        if (routeState.query) {
          urlParts.push(`q=${encodeURIComponent(routeState.query)}`);
        }

        // Handle refinement lists (facets)
        for (const facet in routeState.refinementList) {
          if (routeState.refinementList[facet].length > 0) {
            const facetValues = routeState.refinementList[facet].map(encodeURIComponent).join('+');
            urlParts.push(`${facet}=${facetValues}`);
          }
        }

        // Handle pagination
        if (routeState.page && routeState.page > 1) {
          urlParts.push(`page=${routeState.page}`);
        }

        const queryString = urlParts.length > 0 ? `?${urlParts.join('&')}` : '';
        console.log( `CREATEURL: ${location.origin}${location.pathname}${queryString}`)  // Construct the full URL

        return `${location.origin}${location.pathname}${queryString}`;  // Construct the full URL
      },

      parseURL({ location }) {
        console.log(`parseurl location: ${JSON.stringify(location)}`)
        const params = new URLSearchParams(location.search);
        console.log(`parseurl params: ${JSON.stringify(params)}`)
        const routeState = {};

        if (params.has('q')) {
          routeState.query = params.get('q');
        }

        for (const [key, value] of params.entries()) {
          if (key !== 'q' && key !== 'page') { // Handle facets differently
            routeState.refinementList = routeState.refinementList || {};
            routeState.refinementList[key] = value.split('+').map(decodeURIComponent);
          }
        }

        if (params.has('page')) {
          routeState.page = parseInt(params.get('page'), 10);
        }

        return routeState;
      },
    }),
  },
  */
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
   instantsearch.widgets.clearRefinements({
    container: '#clear-refinements',
  }),

    instantsearch.widgets.stats({
      container: '#stats',
    }),

    instantsearch.widgets.refinementList({
    container: '#refinement-list-zip',
    attribute: "FLNG_ENT_ZIP",
    searchable: true,
    limit: 10,
    searchablePlaceholder: "Search for Zipcodes",
    }),

// FILING_SCHED_DESC

    instantsearch.widgets.refinementList({
    container: '#refinement-list-description',
    attribute: "FILING_SCHED_DESC",
    searchable: true,
    limit: 10,
    searchablePlaceholder: "Search for Description",
    }),
    instantsearch.widgets.refinementList({
    container: '#refinement-list-year',
    attribute: "ELECTION_YEAR",
    searchable: true,
    limit: 10,
    searchablePlaceholder: "Search for Year",
    }),

    instantsearch.widgets.refinementList({
    container: '#refinement-list-source',
    attribute: "_source",
    searchable: true,
    limit: 10,
    searchablePlaceholder: "Search for Source",
    }),

    instantsearch.widgets.refinementList({
    container: '#refinement-list-candidate',
    attribute: "CAND_COMM_NAME",
    searchable: true,
    limit: 10,
    searchablePlaceholder: "Search for Committee/Candidate",
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

    // console.log('debug transform results',results);
    console.log('debug transform items', items);
    document.title = `Election search: ${results.query.substring(0,30)} | Tidalforce`;
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
      let employer= {OCCUPATION: item.OCCUPATION, EMPNAME: item.EMPNAME, EMPSTRNO: item.EMPSTRNO, EMPSTRNAME: item.EMPSTRNAME, EMPCITY: item.EMPCITY, EMPSTATE: item.EMPSTATE, MATCHAMNT: item.MATCHAMNT};
// OCCUPATION: .OCCUPATION, EMPNAME: .EMPNAME, EMPSTRNO: .EMPSTRNO, EMPSTRNAME: .EMPSTRNAME, EMPCITY: .EMPCITY, EMPSTATE: .EMPSTATE, MATCHAMNT: .MATCHAMNT
      let source="";
          let sourcelink="missing"
          let latestlink="missing"
          let socrataid=""

          let messagelink=""
      try {
        // source=item._highlightResult._source.value;
        source=item._source;
        // https://propmarketing.share.zrok.io/opendata/all/us/?metaid=qxzj-vkn2
        switch(source) {
        case "NYC_CONTRIBUTIONS":
        socrataid="rjkp-yttg"
        sourcelink=
          `https://data.cityofnewyork.us/resource/${socrataid}.json?refno=${item.TRANS_NUMBER}`;
        break;
        case "NYC_EXPENDITURES":
        // sourcelink="https://www.nyccfb.info/FTMSearch/Home/FTMSearch";
        // messagelink=`We cannot link directly to the NYC Campaign Finance Database. See <a target="_blank" href="https://youtu.be/EmXtxNBm_2w">step by step video</a> Please click the Source link and then the feedback link and ask for a proper way to link to public information`;
        socrataid="qxzj-vkn2"
        sourcelink=
          `https://data.cityofnewyork.us/resource/${socrataid}.json?refno=${item.TRANS_NUMBER}`;
        break;
        default:
        sourcelink=
          `https://data.ny.gov/resource/e9ss-239a.json?trans_number=${item.TRANS_NUMBER}`;
        break;
        }
      } catch(e){
      }
          try {
          latestlink=`https://open.tidalforce.org/opendata/item/${socrataid}/${encodeURIComponent(textfull)}?offset=0&pagesize=1&order=sched_date+desc#`
          }
          catch (e){
          }

      let TRANSFER_TYPE_DESC="";
      try {
        // TRANSFER_TYPE_DESC=item._highlightResult._TRANSFER_TYPE_DESC.value;
        TRANSFER_TYPE_DESC=item.TRANSFER_TYPE_DESC;
      } catch(e){
      }
      let PURPOSE_CODE_DESC="";
      try {
        // PURPOSE_CODE_DESC=item._highlightResult._PURPOSE_CODE_DESC.value;
        PURPOSE_CODE_DESC=item.PURPOSE_CODE_DESC;
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
          ${PURPOSE_CODE_DESC} 
          ${TRANSFER_TYPE_DESC}
          </div>
          <div class="hit-publication-year">Updated ${item.SCHED_DATE}</div>
          <div class="hit-rating"><b>Year</b> ${item._highlightResult.ELECTION_YEAR.value} <b>for</b> ${item._highlightResult.FILING_SCHED_DESC.value} <i><a target="_blank" href="${sourcelink}">Source</a></i> <b><a target="_blank" href="${latestlink}">Latest</a></b></div>
          <div class="warn">${messagelink}</div>
          <div class="hit-rating">${item._highlightResult.FLNG_ENT_NAME.value} ${item._highlightResult.FLNG_ENT_FIRST_NAME.value} ${item._highlightResult.FLNG_ENT_MIDDLE_NAME.value} ${item._highlightResult.FLNG_ENT_LAST_NAME.value} ${item._highlightResult.FLNG_ENT_ADD1.value} ${item._highlightResult.FLNG_ENT_CITY.value} ${item._highlightResult.FLNG_ENT_ZIP.value}
          <div class="hit-employer">${JSON.stringify(employer,"",3)}</div>
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
      // console.log(`REFINE ${event.currentTarget.value}`)
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
