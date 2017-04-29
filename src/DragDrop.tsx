import * as React from "react";
import * as Rx from "rxjs/Rx";
import "./style.css";

export default class DragDrop extends React.Component<any, any> {
    constructor(props) {
        super();
    }

    componentDidMount() {
        const panel: any = document.querySelector('#dragTarget');
        const mouseDown$ = Rx.Observable.fromEvent(panel, 'mousedown');
        const mouseUp$ = Rx.Observable.fromEvent(document, 'mouseup');
        const mouseMove$ = Rx.Observable.fromEvent(document, 'mousemove');

        const drag$ = mouseDown$.concatMap(() => mouseMove$.takeUntil(mouseUp$));
        drag$.subscribe((event: MouseEvent) => {
            panel.style.left = event.clientX + 'px';
            panel.style.top = event.clientY + 'px';
        });
    }

    render() {
        return (
            <div>
                <div id="dragTarget" />
                Drag Me!
            </div>
        );
    }
}