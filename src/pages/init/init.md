# WebGL과 canvas 기본 설정

> 참고 링크: <https://developer.mozilla.org/ko/docs/Web/API/WebGL_API/Tutorial/Getting_started_with_WebGL>
>
> 목표: WebGL을 이용해 canvas에 회색 화면 보여주기

## WebGLRenderingContext 가져오기

`WebGLRenderingContext`는 OpenGL ES 2.0 그래픽 렌더링 컨텍스트에 대한 인터페이스를 제공한다. 이를 통해 `canvas`에 2D or 3D 그래픽 랜더링이 가능하다.

```ts
const gl = canvas.getContext("webgl");
```

contextId에 `webgl`를 준다. `webgl2`의 경우 WebGL 버전 2(OpenGL ES 3.0)을 구현하는 브라우저에서만 사용 가능한 것이 차이이다.
webgl을 지원하지 않는 브라우저에 대해선 null을 리턴한다.

getContext에 대해 더 알아보려면 해당 [링크](https://developer.mozilla.org/ko/docs/Web/API/HTMLCanvasElement/getContext#contexttype)를 참고한다.

## WebGLRenderingContext 메서드

### clearColor

화면을 색상 버퍼로 초기화할 때 사용한다. 인수로 r,g,b,alpha를 받으며 각각의 값은 0 ~ 1 사이다.
`clear`가 호출될 시 적용된다.

### enable

특정 WebGL 기능을 활성화한다.
기능 목록은 [해당 링크](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/enable#parameters)를 참고한다.
예시로, `DEPTH_TEST`를 사용했다. 이는 깊이 비교를 활성화 하고 깊이 버퍼를 업데이트 한다.
앞에 있는 객체가 뒤에 있는 객체를 가리도록 한다. 만약 활성화 하지 않으면 나중에 그려진 객체가 덮어쓸 뿐이다.

### depthFunc

현재 깊이 버퍼값과 들어오는 픽셀 깊이를 비교한다. `enable(gl.DEPTH_TEST);`을 통해 깊이 비교를 활성화 해야한다.
픽셀이 그려지는 조건을 설정하는 비교 함수를 설정할 수 있다.
목록은 [이곳](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/depthFunc#parameters)에서 확인 가능하다.
예시로 `gl.LESS`를 사용했다. 들어오는 값이 버퍼 값보다 작다면 통과한다.

### clear

버퍼들을 사전 설정한 값으로 초기화하는데 사용한다.
사전 설정 값은 `clearColor`, `clearDepth` 그리고 `clearStencil`로 설정 가능하다.
이를 위해 마스크를 인수로 설정한다. 마스크는 `gl.COLOR_BUFFER_BIT, gl.DEPTH_BUFFER_BIT, gl.STENCIL_BUFFER_BIT` 이 3가지가 있으며, bitwise OR로 여러가지를 설정 가능하다.

### viewport

WebGL이 그리기 작업을 수행하는 영역을 정의한다. x,y로 왼쪽 아래 모서리 좌표를 지정한다. width, height로 뷰포트의 크기를 지정한다.
