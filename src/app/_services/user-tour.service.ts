import { Injectable } from '@angular/core';
import Shepherd from 'shepherd.js';

@Injectable({
    providedIn: 'root'
})
export class UserTourService {

    confirmCancel = false;
    confirmCancelMessage: string = null;
    defaultStepOptions = {
        classes: 'shepherd-theme-arrows custom-default-class',
        // classes: 'shepherd-theme-arrows btn btn-outline btn-outline-secondary font-nunito',
        // scrollTo: true,
        cancelIcon: {
            enabled: true
        }
    };
    errorTitle = null;
    isActive = false;
    messageForUser: string = null;
    modal = true;
    requiredElements = [];
    steps = [];
    tourName = undefined;
    tourObject: Shepherd.Tour = null;

    startTour(steps: Array<any>) {
        this.addSteps(steps);
        this.start();
    }

    /**
 * Creates a button of the specified type, with the given classes and text
 *
 * @param button.type The type of button cancel, back, or next
 * @param button.classes Classes to apply to the button
 * @param button.text The text for the button
 * @param button.action The action to call
 */
    makeButton(buttonType) {
        switch (buttonType) {
            case 'cancel': {
                buttonType = {
                    // classes: 'btn btn-outline-secondary',
                    secondary: true,
                    text: 'Exit',
                    type: 'cancel'
                }
                break;
            }
            case 'next': {
                buttonType = {
                    // classes: 'btn btn-outline',
                    text: 'Got it',
                    type: 'next'
                }
                break;
            }
            case 'back': {
                buttonType = {
                    // classes: 'btn btn-outline-secondary',
                    secondary: true,
                    text: 'Back',
                    type: 'back'
                }
                break;
            }
            case 'start': {
                buttonType = {
                    // classes: 'btn btn-outline',
                    text: 'Start Exploring',
                    type: 'next'
                }
                break;
            }
            default: {
                throw new Error(`'type' property must be one of 'back', 'cancel', or 'next'`);
                // break;
            }
        }

        const { classes, disabled, label, secondary, type, text } = buttonType;
        // const builtInButtonTypes = ['back', 'cancel', 'next'];

        // if (!type) {
        //   return buttonType;
        // }

        // if (builtInButtonTypes.indexOf(type) === -1) {
        //   throw new Error(`'type' property must be one of 'back', 'cancel', or 'next'`);
        // }

        return {
            action: this[type].bind(this),
            classes,
            disabled,
            label,
            secondary,
            text
        };
    }


    /**
   * Creates a step in the user tour
   *
   * @param title The title of the step
   * @param text Body text of the step
   * @param element The id or class name of the element you want to highlight. For id, pass in '#your-id-name' and for class, pass in '.your-class-name'
   * @param position 'top', 'left', 'bottom' or 'right' of the element
   * @param buttons An array of the buttons you want to include in the footer. Types of buttons include 'next', 'back' and 'cancel'. For example, to have both a 'back' and 'next' button, pass in ['back', 'next'] as the argument.
   */
    createStep(title: string, text: any, element: string, position: string, buttons: Array<any>) {
        for (let button of buttons) {
            button = this.makeButton(button);
        }

        return {
            title: title,
            text: text,
            attachTo: {
                element: element,
                on: position
            },
            buttons: buttons
        }
    }

    back() {
        this.tourObject.back();
    }

    cancel() {
        this.tourObject.cancel();
    }

    complete() {
        this.tourObject.complete();
    }

    hide() {
        this.tourObject.hide();
    }

    next() {
        this.tourObject.next();
    }

    show(id) {
        this.tourObject.show(id);
    }

    start() {
        this.isActive = true;
        this.tourObject.start();
    }

    onTourFinish(completeOrCancel: string) {
        this.isActive = false;
    }

    addSteps(steps: Array<any>) {
        this._initialize();
        const tour = this.tourObject;

        // Return nothing if there are no steps
        if (!steps || !Array.isArray(steps) || steps.length === 0) {
            return;
        }

        if (!this.requiredElementsPresent()) {
            tour.addStep({
                buttons: [{
                    text: 'Exit',
                    action: tour.cancel
                }],
                id: 'error',
                title: this.errorTitle,
                text: [this.messageForUser]
            });
            return;
        }

        steps.forEach((step) => {
            if (step.buttons) {
                step.buttons = step.buttons.map(this.makeButton.bind(this), this);
            }

            tour.addStep(step);
        });
    }

    /**
     * if any elements are not visible or do not exist, tour will not execute.
     */
    private requiredElementsPresent() {
        let allElementsPresent = true;

        this.requiredElements.forEach((element) => {
            const selectedElement = document.querySelector(element.selector);

            if (allElementsPresent && (!selectedElement || this.elementIsHidden(selectedElement))) {
                allElementsPresent = false;
                this.errorTitle = element.title;
                this.messageForUser = element.message;
            }
        });

        return allElementsPresent;
    }

    /**
     * Initializes the tour, creates a new Shepherd.Tour. sets options, and binds events
     */
    private _initialize() {
        const tourObject = new Shepherd.Tour({
            confirmCancel: this.confirmCancel,
            confirmCancelMessage: this.confirmCancelMessage,
            defaultStepOptions: this.defaultStepOptions,
            tourName: this.tourName,
            useModalOverlay: this.modal
        });

        tourObject.on('complete', this.onTourFinish.bind(this, 'complete'));
        tourObject.on('cancel', this.onTourFinish.bind(this, 'cancel'));

        this.tourObject = tourObject;
    }



    /**
   * Helper method to check if element is hidden, since we cannot use :visible without jQuery
   * @param element The element to check for visibility
   * @returns true if element is hidden
   */
    elementIsHidden(element: HTMLElement): boolean {
        return element.offsetWidth === 0 && element.offsetHeight === 0;
    }
}
