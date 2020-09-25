import { 
  ARCSavedRequest, 
  ARCHistoryRequest, 
  ARCProject, 
  ARCRequestDeletedEvent,
  ARCRequestUpdatedEvent,
  ARCEntityChangeRecord,
  ARCProjectUpdatedEvent,
  ARCModelStateDeleteEvent,
} from '@advanced-rest-client/arc-models';
import { TemplateResult } from 'lit-html';
import {
  busyTemplate,
  listTypeValue,
  hasTwoLinesValue,
  requestDeletedHandler,
  requestChangedHandler,
  projectChangeHandler,
  dataImportHandler,
  dataDestroyHandler,
  readType,
  updateListStyles,
  applyListStyles,
  persistRequestsOrder,
  projectRequestChanged,
  requestChanged,
  updateProjectOrder,
  openRequest,
  readProjectRequests,
  queryingValue,
  queryingProperty,
  pageTokenValue,
  makingQueryValue,
  loadPage,
  prepareQuery,
  handleError,
  selectedItemsValue,
  selectableValue,
  listTemplate,
  requestItemSelectionTemplate,
  requestItemActionsTemplate,
  detailsItemHandler,
  navigateItemHandler,
  requestItemLabelTemplate,
  itemClickHandler,
  notifySelection,
  dragStartHandler,
  dropTargetTemplate,
  unavailableTemplate,
  listScrollHandler,
} from './internals.js';

declare function RequestsListMixin<T extends new (...args: any[]) => {}>(base: T): T & RequestsListMixinConstructor;

export {RequestsListMixinConstructor};
export {RequestsListMixin};

declare interface RequestsListMixinConstructor {
  new(...args: any[]): RequestsListMixin;
}

declare interface RequestsListMixin {
  /**
   * The list of request to render.
   * It can be either saved, history or project items.
   */
  requests: any[];
  /**
   * Requests list type. Can be one of:
   * - saved
   * - history
   * - project
   *
   * Depending on the the type request change event is handled differently.
   * For saved and history requests corresponding type is processed.
   * For project requests list only request that has project id in the
   * projects list is processed.
   *
   * This property must be set.
   * @attribute
   */
  type: 'saved'|'history'|'project';

  /**
   * Project datastore ID to display.
   * This should be set only when type is `project`
   * @attribute
   */
  projectId?: string;
  /**
   * Changes information density of list items.
   * By default it uses material's list item with two lines (72px height)
   * Possible values are:
   *
   * - `default` or empty - regular list view
   * - `comfortable` - enables MD single line list item vie (52px height)
   * - `compact` - enables list that has 40px height (touch recommended)
   * @attribute
   */
  listType: string;
  /**
   * A project object associated with requests.
   * This is only valid when `type` is set to `project`. It is set automatically
   * when `readProjectRequests()` is called.
   */
  project?: ARCProject;
  /**
   * Single page query limit.
   * @attribute
   */
  pageLimit: number;
  /**
   * When set this component is in search mode.
   * This means that the list won't be loaded automatically and
   * some operations not related to search are disabled.
   * @attribute
   */
  isSearch: boolean;
  /**
   * When set it won't query for data automatically when attached to the DOM.
   * @attribute
   */
  noAuto: boolean;
  /**
   * When set the datastore query is performed with `detailed` option
   * @attribute
   */
  detailedSearch: boolean;
  /**
   * Adds draggable property to the request list item element.
   * The `dataTransfer` object has `arc/request-object` mime type with
   * serialized JSON with request model.
   * @attribute
   */
  draggableEnabled: boolean;
  /**
   * Enables compatibility with Anypoint platform
   * @attribute
   */
  compatibility: boolean;

  /**
   * List of selected requests' ids. It returns null when the `selectable` is not set.
   */
  selectedItems: string[]|null;
  /**
   * When set the selection controls are rendered
   * @attribute
   */
  selectable: boolean;
  /**
   * When set it adds action buttons into the list elements.
   * @attribute
   */
  listActions: boolean;
  /**
   * Computed value, true when the project has requests.
   */
  readonly hasRequests: boolean;
  /**
   * True when the element is querying the database for the data.
   */
  readonly querying: boolean;
  [listTypeValue]: string;
  /**
   * True if the list item should be consisted of two lines of description.
   */
  readonly hasTwoLines: boolean;
  [hasTwoLinesValue]: boolean;

  [queryingValue]: boolean;
  [queryingProperty]: boolean;
  [pageTokenValue]: string;
  [makingQueryValue]: boolean;
  /**
   * True when there's no requests after refreshing the state.
   */
  readonly dataUnavailable: boolean;
  /**
   * Computed value. True when the query has been performed and no items
   * has been returned. It is different from `listHidden` where less
   * conditions has to be checked. It is set to true when it doesn't
   * have items, is not loading and is search.
   */
  readonly searchListEmpty: boolean;
  [selectedItemsValue]: string[];
  [selectableValue]: boolean;

  connectedCallback(): void;
  disconnectedCallback(): void;
  /**
   * Refreshes the data from the datastore.
   * It resets the query options, clears requests and makes a query to the datastore.
   */
  refresh(): void;

  /**
   * Resets the state of the variables.
   */
  reset(): void;

  /**
   * Loads next page of results. It runs the task in a debouncer set to
   * next render frame so it's safe to call it more than once at the time.
   */
  loadNext(): void;

  /**
   * Queries for the request data,
   *
   * @param query The query term
   * @returns Resolved promise when the query ends.
   */
  query(query: string): Promise<void>;

  /**
   * Handler for `request-object-deleted` event. Removes request from the list
   * if it existed.
   * @param {} e
   */
  [requestDeletedHandler](e: ARCRequestDeletedEvent): void;

  /**
   * Handler for the request update event.
   * 
   * Depending on the `type` property it updates / adds / removes item from the requests list.
   */
  [requestChangedHandler](e: ARCRequestUpdatedEvent): Promise<void>;

  /**
   * Handler for `data-imported` custom event.
   * Refreshes data state.
   */
  [dataImportHandler](): void;

  /**
   * Handler for the `datastore-destroyed` custom event.
   * If one of destroyed databases is history store then it refreshes the sate.
   */
  [dataDestroyHandler](e: ARCModelStateDeleteEvent): void;

  /**
   * Handles request change when type is project.
   * @param request Changed request object.
   */
  [projectRequestChanged](request: ARCSavedRequest): void;

  /**
   * Handles request change when type is project.
   * @param request Changed request object.
   */
  [requestChanged](request: ARCSavedRequest|ARCHistoryRequest): void;

  /**
   * A function to read request data for a project.
   * 
   * @param id Project ID
   * @returns Promise resolved to the list of project requests.
   */
  [readProjectRequests](id: string): Promise<ARCSavedRequest[]>;

  /**
   * @returns The type used in the ARC request model.
   */
  [readType](): string;

  /**
   * Updates icon size CSS variable and notifies resize on the list when
   * list type changes.
   */
  [updateListStyles](type: string): void;
  
  /**
   * Applies `--anypoint-item-icon-width` CSS variable.
   * 
   * @param size Icon width in pixels.
   * @param target The target to apply styling. Default to this.
   */
  [applyListStyles](size: number, target?: HTMLElement): void;
  
  /**
   * Stores current order of requests in the project.
   * 
   * @return Change record or undefined when it has the same order
   */
  [persistRequestsOrder](): Promise<ARCEntityChangeRecord<ARCProject>|undefined>;

  /**
   * Handler for the project change event.
   * 
   * @param {ARCProjectUpdatedEvent} e
   */
  [projectChangeHandler](e: ARCProjectUpdatedEvent): void;

  /**
   * Updates requests order when project changed.
   * It reorder requests array for changed project order. It won't change
   * requests array when order is the same. It also won't change order when
   * request list is different that project's requests list.
   * @param {ARCProject} project Changed project
   * @return {Boolean} True when order has changed
   */
  [updateProjectOrder](project: ARCProject): boolean;

  /**
   * Dispatches navigate event to open a request
   * @param id The id of the request to open.
   */
  [openRequest](id: string): void;

  /**
   * Loads next page of results from the datastore.
   * Pagination used here has been described in PouchDB pagination strategies
   * document.
   */
  [loadPage](): Promise<void>;

  /**
   * Prepares a query string to search the data store.
   * @param query User search term
   * @returns Processed query
   */
  [prepareQuery](query: string): string;

  /**
   * Handles any error.
   */
  [handleError](cause: Error): void;

  /**
   * A handler for the click on the `open` request button.
   * The target has to have `data-id` set to the request id.
   */
  [navigateItemHandler](e: PointerEvent): void;

  /**
   * A handler for the click on the `details` request button.
   * The target has to have `data-id` set to the request id.
   */
  [detailsItemHandler](e: PointerEvent): void;

  /**
   * A handler for list item click. Depending on the `selectable` property state
   * it navigates to the request (false) or toggles item selection (true).
   * 
   * The target has to have `data-id` set to the request id.
   */
  [itemClickHandler](e: PointerEvent): void;

  /**
   * Dispatches the `select` event when selection change.
   */
  [notifySelection](): void;

  /**
   * Handler for the `dragstart` event added to the list item when `draggableEnabled`
   * is set to true. This function sets request data on the `dataTransfer` 
   * with the following properties:
   * - `arc/id` with value of the id of the dragged request
   * - `arc/type` with value of the current type
   * - `arc/request` which indicates the dragged property is a request 
   * - `arc/source` with the name of the element
   * Additionally the function sets default `effectAllowed` to copy.
   */
  [dragStartHandler](e: DragEvent): void;

  [listScrollHandler](e: Event): void;

  /**
   * This method to be implemented by the element to render the list of items.
   * @returns Template for the list items.
   */
  [listTemplate](): string|TemplateResult;

  /**
   * @param id The id of the request
   * @returns Template for a selection control
   */
  [requestItemSelectionTemplate](id: string): TemplateResult|string;

  /**
   * @param id The id of the request
   * @returns Template for a request's list item actions
   */
  [requestItemActionsTemplate](id: string): TemplateResult|string;

  /**
   * @param method The HTTP method name.
   * @returns Template for a request's http label
   */
  [requestItemLabelTemplate](method: string): TemplateResult|string;

  /**
   * @returns A template with the drop request message
   */
  [dropTargetTemplate](): TemplateResult;

  /**
   * @returns A template for when data are unavailable.
   */
  [unavailableTemplate](): TemplateResult|string;

  /**
   * @returns A template for the loader element
   */
  [busyTemplate](): TemplateResult|string;
}