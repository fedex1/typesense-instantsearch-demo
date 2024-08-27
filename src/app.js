/* global instantsearch */
// {"first_name":"Crystal","last_name":"Devitt","addresses":{},"gender":"female","age":46,"birth_date":"1977-11-25","email":"monchiquita@gmail.com","name":"Crystal Devitt"}

import TypesenseInstantSearchAdapter from 'typesense-instantsearch-adapter';
import debounce from 'lodash.debounce';
import { currentRefinements } from 'instantsearch.js/es/widgets';

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
  geoLocationField: 'location',
  additionalSearchParameters: {
    // queryBy: 'title,authors',
    // queryBy: 'data.PropAddr,data.PropOwner',
    // queryBy: "data.searchkey, data.id, data.BillYear, data.PropAddr, data.PropAssessed, data.PropOwes, data.PropOwner, data.description, data.eventid",
    query_by: "filter,snippet,loc,lastmod",
    // filter_by: "priceINT:[1000..6000]",
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
  // routing: true,
  routing: {
        stateMapping: {
      stateToRoute(uiState) {
        // ...
        if (window.search.helper){
        const currentfilter=window.search.helper.getQuery();
        // console.log(`debug: ${JSON.stringify(currentfilter)}`);
        if (currentfilter.aroundLatLng){
            uiState[index].configure.aroundLatLng=currentfilter.aroundLatLng;
        }
        if (currentfilter.aroundRadius){
            uiState[index].configure.aroundRadius=currentfilter.aroundRadius;
        }
        }
        // console.log(`stateToRoute: ${JSON.stringify(uiState)}`);
        return uiState;
      },
      routeToState(routeState) {
        // ...
        if (window.search.helper){
        const currentfilter=window.search.helper.getQuery();
        // console.log(`debug: ${JSON.stringify(currentfilter)}`);
        }
        // console.log(`routeToState: ${JSON.stringify(routeState)}`);
        return routeState;
      },
      }
    /*
    instantsearch.routers.history({

      createURL({ qsModule, location, routeState }) {
        const currentfilter=window.search.helper.getQuery();
        console.log(`debug: ${JSON.stringify(currentfilter)}`);

        const indexState = routeState[index] || {};
        const { origin, pathname, hash, search } = location;
        // grab current query string, remove the trailing `?` and convert to object
        const queryParameters = qsModule.parse(search.slice(1)) || {};

        // if there is an active search
        if (Object.keys(indexState).length ){
          // merge the search params with the current query params
          Object.assign(queryParameters, routeState);
        }else{
          // remove the search params
          delete queryParameters[index];
        }

        let queryString = qsModule.stringify(queryParameters);

        if(queryString.length){
          queryString = `?${queryString}`;
        }

        return `${origin}${pathname}${queryString}${hash}`;
      },
    })
      */
  }
});
window.search=search;

            // ${item._highlightResult.title.value}
          // ${item._highlightResult.authors.map((a) => a.value).join(', ')}
const lastfewdays_seconds=Math.floor(new Date().getTime()/1000) - (7 * 24 * 60 * 60);
search.addWidgets([
  instantsearch.widgets.searchBox({
    container: '#searchbox',
    placeholder: "Search for zip, address, etc.",
    autofocus: true,
  }),
  instantsearch.widgets.configure({
    hitsPerPage: 10,
    // filters: "priceINT:[1000..6000]",
    // filters: "priceINT:[1000..6000] && lastmodINT:>1724008973",
    filters: `priceINT:[1000..6000] && lastmodINT:>${lastfewdays_seconds}`,
     // aroundLatLng: '39.930984, -75.1614913',
     // aroundRadius: 1000,
  }),
   instantsearch.widgets.clearRefinements({
    container: '#clear-refinements',
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
    // console.log('debug transform items', items);
    // console.log('debug transform results', results);
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
      let text=item.filter||item.id;
      const LIMIT=100;
      const LIMIT2=1000;
      if (text.length > LIMIT) {
        // text = text.substring(0, LIMIT) + '...';
        text = text.slice(-LIMIT);
      }

        text = text.replace(/[\/]/g,' ');
        let nearbylink="";
        // console.log(`queryparameters: ${search.helper.getQuery().filter}`);
        const currentfilter=search.helper.getQuery();
        const action=`javascript:window.search.helper.setQueryParameter('aroundLatLng', '${item.location}').setQueryParameter('aroundRadius', '2000m').search();`;
        // const action=`javascript:instantsearch.widgets.configure({ aroundLatLng: '${String(item.location)}', aroundRadius: '2000m'  });`;
        const actionclear=`javascript:window.search.helper.setQueryParameter('aroundLatLng').setQueryParameter('aroundRadius').search();`;
        if (item.location){
         nearbylink=`<a href="${action}">Nearby<!--${item.location}--></a> | 
         <a href="${actionclear}">All</a>`;
            if (currentfilter.aroundLatLng===String(item.location)){
                nearbylink+= " <b>SELECTED</b>"; 
            }
        }
        return `
        <div>
          <div class="hit-name">
            <a target="_blank" href="${item.loc}">${format.format(item.priceINT)} ${text}</a>
          </div>
          <div class="hit-authors">
          </div>
          <div class="hit-publication-year">Updated <b>${timeSince(item.lastmodINT*1000)} ago</b> ${item.lastmod}</div>
          <div class="hit-rating">Cache: ${item._highlightResult.snippet.value.substring(0,LIMIT2)} ${nearbylink}</div>
          <div class="stats">(query "${item.query}" sum ${format.format(item.stats.priceINT.sum)} average ${format.format(item.stats.priceINT.avg)} max ${format.format(item.stats.priceINT.max)}  min ${format.format(item.stats.priceINT.min)} filter: ${currentfilter.filters||''} ${currentfilter.aroundLatLng||''}  ${currentfilter.aroundRadius?currentfilter.aroundRadius+'m':''})</div>
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
  currentRefinements({
      container: '#current-refinements',
  }),

  instantsearch.widgets.sortBy({
    container: '#sort-by',
       items: [
      { label: "Date (asc)", value: `${index}/sort/lastmodINT:asc` },
      { label: "Date (desc)", value: `${index}/sort/lastmodINT:desc` },
      { label: "Price (asc)", value: `${index}/sort/priceINT:asc` },
      { label: "Price (desc)", value: `${index}/sort/priceINT:desc` },
    ],
  }),
]);

search.use(googleAnalyticsMiddleware);

search.start();

// search.helper.setQueryParameter('aroundLatLng', this.value).search();
// search.helper.setQueryParameter('aroundLatLng', '39.930984, -75.1614913').setQueryParameter('aroundRadius', '1000m').search();

