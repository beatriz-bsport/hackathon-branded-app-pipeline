# Delete object

To avoid storing deletion checks result in a simple modal state, we **dedicate a store section**, `state.deleteObject`, to it.
This store section is divided in subsections, each one corresponding to an object type (`Establishment`, for example).

### How to check and delete an object ?

For every object types, here is the pattern followed by `<DeleteObjectModal />`, before deleting an object:

1. Clear the dedicated store section. Use the `getDefaultDeleteObjectSection` method for it.

2. Check if the object can be deleted with a specific API call, `canDeleteObject()`.
The response has to returns a boolean, `can_destroy`, and additional data.
(Some actions can adjust `isLoading` and `error` fields aside)
A `success` action should :
    - Fill the `checkData` and `canDestroy` fields
    - *Copy the id object to delete* in the `id` field

3. Once this action has been dispatched, we can  manually call a `deleteObject()` method, via the modal button.
To make all this process safe, `deleteObject` should always take as argument **the id stored in the store section**.
This way, we ensure that the pre-deletion checks have been made and the object id is the correct one.
In other words, `canDestroy = true` &hArr; `id != null` &rArr; `deleteObject` can be called

4. Clear the store section when closing the modal.
