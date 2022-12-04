/*
* This animation is fucking unstable.
* If you use it on elements that have EQUAL size, than everything's gonna be okay.
* If you apply this animation on elements that have DIFFERENT size,
* it's gonna work the way it's not supposed to work. It can look acceptable, but chances aren't high.
*/

let targets = document.querySelectorAll(".circle-animation");

targets.forEach((target, index) => setCircleAnimation(target, index));

function setCircleAnimation(target, index) {
    target.insertAdjacentHTML("beforeend", `<div class="circle-animation__wrapper">
                            <div class="circle-animation__circle"></div>
                         </div>`);

    let circle = document.querySelectorAll(".circle-animation__circle")[index];
    let circleAnimation = circle.getAnimations()[0];

    let rect = target.getBoundingClientRect();
    let circleSize = Math.sqrt( (rect.width ** 2) + (rect.height ** 2) );
    circleSize = Math.round(circleSize) * 2;

    // hmmmm what if the targeted elements have different size lol?
    let root = document.documentElement;
    root.style.setProperty('--circle-width', circleSize + "px");
    root.style.setProperty('--circle-height', circleSize + "px");

    target.addEventListener('click', (e) => {
        let rect = target.getBoundingClientRect();
        let x = Math.round(rect.x);
        let y = Math.round(rect.y);

        circle.style.left = e.clientX - x + "px";
        circle.style.top = e.clientY - y + "px";

        if (circleAnimation.playState === "running") {
            circleAnimation.cancel();
        }

        circleAnimation.play();
    });
}