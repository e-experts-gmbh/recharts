Summary
=======
The fork of recharts had 2 main reasons:
- The `Brush` Component is not supported within `ScatterChart` and does not support an `XAxis` of type `number`.
- When dragging a brush traveller and releasing it outside the brush, the traveller keeps following the mouse until dragged and released again inside the brush.

You can look at the file [not_working_example.js](./not_working_example.js) to see for yourself what's not working.

Both of these 2 isses were fixed in this repository, but the fixes are not in shape to be merged back into official recharts repository, because of the following reasons:
- when we added support for an `XAxis` of type `number` we broke support for type `category`, and because we didn't have the time nor the need to fix this, this problem is still there, and needs to be resoved before merging back.
- since both fixes are in the `Brush` component, it was easier and faster for us to put the traveller fix on top of the scatterchart fix. But since the fix depends on a fix that is not ready to be merged, the fix cannot be merged as well.

explanation of the changes
--------------------------

In 40682a3e80dd8de7e6e3073b708a2593824ccbfe we changed the following:
Through `props.data`, the `Brush` component gets an array of all entries on the chart. Previously, the what the brush did was filtering by the indexes of these entries. So, if the chart had 5 entries, the brush had a range of 0-4, and x-cooridnates in the brush where mapped to one of these indexes through `scalePoint`. But for an axis of type `number`, we are not interested in the indexes of the entries, but rather the values, or to be more specific the min and max value of these values. We no longer want to map an x-coordinate in the brush to an array index, but rather to an actual value. Thats why we changed `scalePoint` to `scaleLinear`. And because a linear scale is also reversible, we also didn't need `getIndexInRange` anymore. Understanding, that we basically swapped those two functions, helps understanding the rest of the change.

In dc05ce020531517b3b19dc3e4b1de5e1d7e99f1a we changed the following:
Instead of registering the onMouseMove and onMouseUp listeners on the brush component, we registered them on the document directly when the user starts dragging the traveller. Because of this, we now also receive `mousemove` and `mouseup` events when the cursor is outside of the Brush component. At dragend, we then remove those listeners. Another problem was that moving worked based on a delta that was calculated everytime the mouse moved. And an additional mousemove then had the new traveller position as origin. Before, this was no problem, but since now the delta is also calculated when moving the mouse outside of the brush, the position of the traveller was no longer in sync with the mouse position when reentering the brush. Therefore whe changed the logic a bit, so that now it just saves the starting position of the traveller and the mouse once when pressing the mouse, and then when moving the mouse calculates the traveller position based on these two starting points.


potential github issues to open at the official recharts repo
-------------------------------------------------------------

### Add support for Brush in ScatterChart

Currently, despite the documentation for [Brush](http://recharts.org/en-US/api/Brush) saying that it can be used within a ScatterChart, it does not really work.

The reason for this is, that Brush does not support arbitary steps on the x-axis, and instead only supports fixed steps. Or said differently, it does not support an x-axis of type "number", but only "category".

This has already been noticed by other people as well in #306, but the issue was closed whithout a fix, but with a very limited workaraound.

Since we need a Brush in ScaterChart with X- and Y-axis both being of type number, we forked the library a while ago and modified the code of Brush to do what we want. This code can be found here:
https://github.com/VanCoding/recharts

The problem with it is that in this form, it does no longer work with an axis of type "category", so the code could not just be merged right now. Sadly, we don't have the time to bring these changes in a state that could be merged, but we hope you can use it to solve this issue on your own an maintain it upstream.

What do you think?

### Fix bug in Brush component, where releasing a traveller outside the brush, does not actually release it

Currently there is the following bug in the Brush component:
When you click on a traveller, hold it, drag the mouse out of the Brush area, and then release it, it does not actually get released. Instead, if you then enter the Brush with the mouse again, the traveller still follows the mouse until dragged and released again (inside the Brush this time of course).

Our users find this very annoying and therefore we request a fix for this.

We think that the problem is, that all mouse event listeners are only registered for the Brush-component itself. and when the user released the mouse outside of it, it does not get a mouse event. A simple fix for this would be, to register mouse event listeners on the document directly, after a traveller gets pressed, and unregister them as soon as it gets released.

What do you think?
