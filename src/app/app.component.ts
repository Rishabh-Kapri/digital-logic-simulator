import {
  AfterViewInit,
  Component,
  ElementRef,
  QueryList,
  ViewChild,
  ViewChildren,
  ViewEncapsulation,
} from '@angular/core';
import { filter, fromEvent, map, Observable, pairwise, switchMap, takeUntil, tap } from 'rxjs';
import { PaperScope, Project, Path } from 'paper';
import { Color, Point, Rectangle, Segment, Tool } from 'paper/dist/paper-core';
import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { AngularRenderPlugin } from 'rete-angular-render-plugin';
import { NodeEditor } from 'rete';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  // @ViewChild('canvas', { static: true }) canvas!: ElementRef;
  // @ViewChildren('gatesEle') gatesEle!: QueryList<ElementRef>;
  // firstMouseDown!: { x: number; y: number } | null;
  // startLineDraw!: paper.Point | null;
  gates = [
    {
      name: 'And',
      icon: '../assets/and-gate.svg',
    },
    {
      name: 'Or',
      icon: '../assets/and-gate.svg',
    },
  ];

  // scope!: paper.PaperScope;
  // project!: paper.Project;
  // tool!: paper.Tool;
  // selectedItem!: paper.Item | null;
  // cx!: CanvasRenderingContext2D;
  // constructor() {}
  // drawSvg(point: paper.Point) {
  //   const svg = this.project.importSVG('../assets/and-gate 1.svg', {
  //     expandShapes: true,
  //     insert: true,
  //     onLoad: (item: paper.Item) => {
  //       console.log(item);
  //       let linePath: paper.Path.Line;
  //       let isDrag = false;
  //       let ioSelected = false;
  //       item.onMouseEnter = (event: Event) => {
  //         this.selectedItem = item;
  //         // console.log('Entered item');
  //       };
  //       item.onMouseUp = (event: paper.MouseEvent) => {
  //         isDrag = false;
  //       };
  //       item.onMouseDrag = (event: paper.MouseEvent) => {
  //         isDrag = true;
  //         if (ioSelected) {
  //           console.log('Higher than 100');
  //           linePath.add(event.point);
  //         } else {
  //           const currentPos = item.position;
  //           const newPos = new Point(currentPos.x + event.delta.x, currentPos.y + event.delta.y);
  //           item.position = newPos;
  //         }
  //       };
  //       item.onMouseLeave = (event: paper.MouseEvent) => {
  //         this.selectedItem = null;
  //       };
  //       item.onMouseDown = (event: paper.MouseEvent) => {
  //         // console.log('Mouse down on item', event);
  //       };
  //       // item.position = new Point(100, 50);
  //       const outputPos = [94.5, 27.5];
  //       const inputAPos = [3.98616, 11.2];
  //       const inputBPos = [3.98616, 44.8];
  //       const output = item.getItem({
  //         position: [...outputPos],
  //       });
  //       const inputA = item.getItem({
  //         position: [...inputAPos],
  //       });
  //       const inputB = item.getItem({
  //         position: [...inputBPos],
  //       });
  //       output.onMouseEnter = (event: paper.MouseEvent) => {
  //         output.selected = true;
  //       };
  //       output.onMouseLeave = (event: paper.MouseEvent) => {
  //         output.selected = false;
  //       };
  //       output.onMouseDown = (event: paper.MouseEvent) => {
  //         console.log('Output clicked', event.point, isDrag);
  //         if (!isDrag) {
  //           // initialise a line to be drawn to the next IO
  //           this.startLineDraw = event.point;
  //           ioSelected = true;
  //           linePath = new Path({
  //             segments: [event.point],
  //             strokeColor: new Color(255, 255, 255),
  //             strokeWidth: 2,
  //           });
  //           // linePath = new Path.Line(event.point, event.point);
  //           // linePath.strokeColor = new Color(255, 255, 255);
  //           // linePath.strokeWidth = 2;
  //         }
  //       };
  //       output.onMouseUp = (event: paper.MouseEvent) => {
  //         linePath.simplify();
  //       };
  //       inputA.onMouseDown = (event: paper.MouseEvent) => {
  //         console.log('Input A clicked', event.point);
  //         if (this.startLineDraw) {
  //           const point1 = this.startLineDraw.clone();
  //           const point2 = event.point.clone();
  //           this.drawLine(point1, point2);
  //         }
  //       };
  //       inputB.onMouseDown = (event: paper.MouseEvent) => {
  //         console.log('Input B clicked', event.point);
  //         if (this.startLineDraw) {
  //           const point1 = this.startLineDraw.clone();
  //           const point2 = event.point.clone();
  //           this.drawLine(point1, point2);
  //         }
  //       };
  //       item.position = point;
  //     },
  //   });
  // }
  // drawLine(point1: paper.Point, point2: paper.Point) {
  //   console.log('drawing line', point1, point2);
  //   const through = new Point(0, 0);
  //   const rc = new Rectangle(point1, point2);
  //   const c1 = new Path.Circle(rc.topCenter, 3);
  //   const c2 = new Path.Circle(rc.bottomCenter, 3);
  //   c1.fillColor = c2.fillColor = new Color(255, 0, 0);
  //   const h1 = new Point(rc.topCenter.x - point1.x, rc.topCenter.y - point1.y);
  //   const h2 = new Point(rc.topCenter.x - point2.x, rc.topCenter.y - point2.y);
  //   const point1Seg = new Segment(point1, undefined, h1);
  //   const point2Seg = new Segment(point2, h2, undefined);
  //   const connector = new Path([point1Seg, point2Seg]);
  //   connector.strokeColor = new Color(255, 255, 255);
  //   connector.strokeWidth = 2;
  //   this.startLineDraw = null;
  // }
  // ngAfterViewInit() {
  //   for (const gate of this.gatesEle) {
  //     fromEvent(gate.nativeElement, 'mousedown')
  //       .pipe(map((v) => v as MouseEvent))
  //       .subscribe((val: MouseEvent) => {
  //         this.firstMouseDown = { x: val.clientX, y: val.clientY };
  //         console.log(val);
  //       });
  //   }
  //   const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
  //   // this.scope = new PaperScope();
  //   // this.scope.setup(canvasEl);
  //   this.project = new Project(canvasEl);
  //   this.tool = new Tool();
  //   this.tool.activate();
  //   this.tool.minDistance = 100;
  //   this.project.view.onMouseDown = (event: paper.MouseEvent) => {
  //     const nativeEvent: MouseEvent = (event as any).event;
  //     switch (nativeEvent.button) {
  //       case 0: {
  //         // left click
  //         // console.log('Left click registered');
  //         break;
  //       }
  //       case 2: {
  //         nativeEvent.preventDefault();
  //         console.log('Right click registered');
  //         break;
  //       }
  //     }
  //     if (this.firstMouseDown) {
  //       const point = event.point;
  //       console.log(point);
  //       this.drawSvg(point);
  //       this.firstMouseDown = null;
  //     }
  //     if (this.selectedItem) {
  //     }
  //   };
  //   // this.cx = canvasEl.getContext('2d') as CanvasRenderingContext2D;
  //   // canvasEl.width = 1000;
  //   // canvasEl.height = 1000;
  //   // this.cx.lineWidth = 2;
  //   // this.cx.lineCap = 'round';
  //   // this.cx.strokeStyle = '#000';
  //   const pathArray = [
  //     {
  //       type: 'path',
  //       pathData: {
  //         path: 'M17.9446 2L24.6654 2L57.8834 2C65.406 2 70.9574 5.19424 74.6775 9.97779C78.4395 14.8151 80.3806 21.3598 80.3806 28C80.3806 34.6402 78.4395 41.1849 74.6775 46.0222C70.9574 50.8058 65.406 54 57.8834 54H57.6922H57.5017H57.3116H57.1221H56.9331H56.7447H56.5567H56.3694H56.1825H55.9962H55.8104H55.6251H55.4403H55.2561H55.0724H54.8893H54.7066H54.5245H54.3429H54.1619H53.9813H53.8013H53.6218H53.4428H53.2644H53.0864H52.909H52.7321H52.5557H52.3798H52.2045H52.0297H51.8553H51.6815H51.5082H51.3355H51.1632H50.9914H50.8202H50.6495H50.4792H50.3095H50.1403H49.9716H49.8034H49.6357H49.4686H49.3019H49.1357H48.9701H48.8049H48.6403H48.4761H48.3125H48.1493H47.9867H47.8245H47.6629H47.5017H47.3411H47.1809H47.0213H46.8621H46.7034H46.5453H46.3876H46.2304H46.0737H45.9175H45.7618H45.6066H45.4519H45.2976H45.1439H44.9906H44.8379H44.6856H44.5338H44.3825H44.2317H44.0813H43.9315H43.7821H43.6332H43.4848H43.3369H43.1894H43.0425H42.896H42.75H42.6045H42.4594H42.3149H42.1708H42.0271H41.884H41.7413H41.5991H41.4574H41.3162H41.1754H41.0351H40.8953H40.7559H40.617H40.4786H40.3406H40.2032H40.0661H39.9296H39.7935H39.6579H39.5227H39.388H39.2538H39.12H38.9867H38.8539H38.7215H38.5896H38.4581H38.3271H38.1966H38.0665H37.9369H37.8077H37.679H37.5507H37.4229H37.2955H37.1686H37.0422H36.9162H36.7907H36.6656H36.5409H36.4167H36.293H36.1697H36.0468H35.9244H35.8025H35.681H35.5599H35.4393H35.3191H35.1994H35.0801H34.9612H34.8428H34.7248H34.6073H34.4902H34.3736H34.2574H34.1416H34.0263H33.9114H33.7969H33.6829H33.5693H33.4561H33.3434H33.2311H33.1192H33.0078H32.8968H32.7862H32.6761H32.5663H32.4571H32.3482H32.2398H32.1318H32.0242H31.917H31.8103H31.704H31.5981H31.4926H31.3876H31.283H31.1788H31.075H30.9716H30.8687H30.7662H30.6641H30.5624H30.4611H30.3602H30.2598H30.1598H30.0602H29.961H29.8622H29.7638H29.6658H29.5683H29.4711H29.3744H29.278H29.1821H29.0866H28.9915H28.8968H28.8025H28.7086H28.6151H28.522H28.4294H28.3371H28.2452H28.1537H28.0626H27.972H27.8817H27.7918H27.7023H27.6132H27.5246H27.4363H27.3484H27.2609H27.1737H27.087H27.0007H26.9148H26.8292H26.7441H26.6593H26.575H26.491H26.4074H26.3242H26.2414H26.1589H26.0769H25.9952H25.914H25.8331H25.7526H25.6724H25.5927H25.5133H25.4344H25.3558H25.2775H25.1997H25.1222H25.0451H24.9684H24.8921H24.8161H24.7406H24.6654H24.5905H24.5161H24.442H24.3683H24.2949H24.2219H24.1493H24.0771H24.0052H23.9337H23.8626H23.7918H23.7214H23.6514H23.5817H23.5124H23.4435H23.3749H23.3067H23.2389H23.1714H23.1042H23.0375H22.971H22.905H22.8393H22.774H22.709H22.6444H22.5801H22.5162H22.4526H22.3894H22.3266H22.2641H22.2019H22.1401H22.0787H22.0176H21.9568H21.8964H21.8364H21.7767H21.7173H21.6583H21.5996H21.5413H21.4833H21.4257H21.3684H21.3115H21.2549H21.1986H21.1427H21.0871H21.0318H20.9769H20.9223H20.8681H20.8142H20.7607H20.7074H20.6545H20.602H20.5498H20.4979H20.4463H20.3951H20.3442H20.2936H20.2434H20.1935H20.1439H20.0947H20.0457H19.9971H19.9489H19.9009H19.8533H19.806H19.759H19.7124H19.666H19.62H19.5743H19.529H19.4839H19.4392H19.3948H19.3507H19.3069H19.2635H19.2203H19.1775H19.135H19.0928H19.0509H19.0093H18.9681H18.9271H18.8865H18.8461H18.8061H18.7664H18.727H18.6879H18.6491H18.6106H18.5725H18.5346H18.497H18.4597H18.4228H18.3861H18.3498H18.3137H18.278H18.2425H18.2074H18.1725H18.1379H18.1037H18.0697H18.036H18.0027H17.9696H17.9446V2Z',
  //         fillColor: new Color(170, 170, 170),
  //         strokeWidth: 4,
  //       },
  //     },
  //     {
  //       type: 'line',
  //       lineData: { from: [82, 27.5], to: [91, 27.5], strokeColor: new Color(170, 170, 170), strokeWidth: 3 },
  //     },
  //     {
  //       type: 'circle',
  //       circleData: { center: [94.5, 27.5], radius: 4.5, fillColor: new Color(170, 170, 170) },
  //     },
  //     {
  //       type: 'line',
  //       lineData: { from: [15.9446, 44.9], to: [6.6436, 44.9], strokeColor: new Color(170, 170, 170), strokeWidth: 3 },
  //     },
  //     {
  //       type: 'ellipse',
  //       ellipseData: { center: [3.98616, 44.8], radius: [3.98616, 4.2], fillColor: new Color(170, 170, 170) },
  //     },
  //     {
  //       type: 'line',
  //       lineData: { from: [15.9446, 11.3], to: [6.6436, 11.3], strokeColor: new Color(170, 170, 170), strokeWidth: 3 },
  //     },
  //     {
  //       type: 'ellipse',
  //       ellipseData: { center: [3.98616, 11.2], radius: [3.98616, 4.2], fillColor: new Color(170, 170, 170) },
  //     },
  //   ];
  //   // pathArray.forEach((path) => {
  //   //   switch (path.type) {
  //   //     case 'line': {
  //   //       new Path.Line(path.lineData as object);
  //   //       break;
  //   //     }
  //   //     case 'circle': {
  //   //       new Path.Circle(path.circleData as object);
  //   //       break;
  //   //     }
  //   //     case 'ellipse': {
  //   //       new Path.Ellipse(path.ellipseData as object);
  //   //       break;
  //   //     }
  //   //     case 'path': {
  //   //       const p = new Path(path.pathData?.path as string);
  //   //       p.fillColor = path.pathData?.fillColor as paper.Color;
  //   //       p.strokeWidth = path.pathData?.strokeWidth as number;
  //   //     }
  //   //   }
  //   // });
  //   // this.captureEvents(canvasEl);
  // }
  // captureEvents(canvasEl: HTMLCanvasElement) {
  //   fromEvent(canvasEl, 'mousedown')
  //     .pipe(
  //       filter((e) => {
  //         console.log(e);
  //         return true;
  //       }),
  //       switchMap((e) => {
  //         const value = fromEvent(canvasEl, 'mousemove').pipe(
  //           takeUntil(fromEvent(canvasEl, 'mouseup')),
  //           takeUntil(fromEvent(canvasEl, 'mouseleave')),
  //           pairwise()
  //         );
  //         return value as Observable<[MouseEvent, MouseEvent]>;
  //       })
  //     )
  //     .subscribe((res: [MouseEvent, MouseEvent]) => {
  //       const rect = canvasEl.getBoundingClientRect();
  //       console.log(rect, res);
  //       const prevPos = {
  //         x: res[0].clientX - rect.left,
  //         y: res[0].clientY - rect.top,
  //       };
  //       const currentPos = {
  //         x: res[1].clientX - rect.left,
  //         y: res[1].clientY - rect.top,
  //       };
  //       this.drawOnCanvas(prevPos, currentPos);
  //     });
  // }
  // drawOnCanvas(prevPos: { x: number; y: number }, currentPos: { x: number; y: number }) {
  //   if (!this.cx) {
  //     return;
  //   }
  //   this.cx.beginPath();
  //   if (prevPos) {
  //     this.cx.moveTo(prevPos.x, prevPos.y);
  //     this.cx.lineTo(currentPos.x, currentPos.y);
  //     this.cx.stroke();
  //   }
  // }
  // drawGate(event: unknown) {
  //   console.log(event);
  // }
}
