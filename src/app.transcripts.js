/* global instantsearch */
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
          let sourcelink="missing";
          let messagelink="";
      try {
        // source=item._highlightResult._source.value;
        source=item._source;
        switch(source) {
        case "NYC_CONTRIBUTIONS":
        sourcelink=
          "https://www.nyccfb.info/FTMSearch/Home/FTMSearch";
        messagelink=`We cannot link directly to the NYC Campaign Finance Database. See <a target="_blank" href="https://youtu.be/EmXtxNBm_2w">step by step video</a> Please click the Source link and then the feedback link and ask for a proper way to link to public information`;
        break;
        default:
        sourcelink=
          `https://data.ny.gov/resource/e9ss-239a.json?trans_number=${item.TRANS_NUMBER}`;
        break;
        }
      } catch(e){
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
          <div class="hit-rating"><b>Year</b> ${item._highlightResult.ELECTION_YEAR.value} <b>for</b> ${item._highlightResult.FILING_SCHED_DESC.value} <i><a target="_blank" href="${sourcelink}">Source</a></i></div>
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



