import {
  Component,
  ComponentFactory,
  ComponentFactoryResolver,
  Injector,
  OnInit,
  ViewChild,
  ViewContainerRef
} from '@angular/core'
import { AlertComponent } from 'src/app/components/alert/alert.component'
import { NewUserService } from 'src/app/shared/service/new-user.service'
import { UserService } from 'src/app/shared/service/user.service'
import { CreditNumberPipe } from '../../shared/pipes/credit-number.pipe'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
  @ViewChild('dynamicComponentContainer', { read: ViewContainerRef })
  dynamicContainer: ViewContainerRef
  myForm: FormGroup;
  listOfOption: string[] = [];
  listOfSelectedValue = ['a10', 'c12'];
  exampleControl = new FormControl('');
  constructor(
    private injector: Injector,
    private userService: UserService,
    private resolver: ComponentFactoryResolver,
    private creditCardPipe: CreditNumberPipe,
    private fb: FormBuilder
  ) { }

  public skills = []

  get name() {
    return this.userService.getData()
  }

  mount: number = null

  color = 'red'

  theme = ''

  show = true

  value = 0
  creditCardNumber: any = '9999999999999999'

  alertComponent

  files = [
    { name: 'logo.svg', size: 2120109, type: 'image/svg' },
    { name: 'banner.jpg', size: 18029, type: 'image/jpg' },
    { name: 'background.png', size: 1784562, type: 'image/png' }
  ]

  context = {
    message: 'Hello ngOutletContext!',
    newMessage: 'Hello New ngOutletContext!',
    $implicit: 'Hello, Semlinker!'
  }

  ngOnInit() {
    this.skills = ['AngularJS 1.x', 'Angular 2.x', 'Angular 4.x', 'Angular 6.x']

    this.creditCardNumber = this.creditCardPipe.transform(
      this.creditCardNumber,
      2
    )

    const service = this.injector.get(NewUserService)
    console.log(service)
    const children: string[] = [];
    for (let i = 10; i < 36; i++) {
      children.push(`${i.toString(36)}${i}`);
    }
    this.listOfOption = children;
    console.log("this.listOfOption", this.listOfOption);
    this.myForm = this.fb.group({
      date: ['', Validators.required],
      control: []
    });

    // Subscribe to valueChanges with proper type handling
    this.myForm.get('control')?.valueChanges.subscribe(value => {
      console.log('Value changed:', value);
    });

    this.exampleControl.valueChanges.subscribe(value => {
      console.log('Value changed to:', value);
    });
  }

  // Method to update value without emitting the event
  updateValueWithoutEmitEvent(newValue: string): void {
    this.myForm.get('control')?.setValue([newValue], { emitEvent: false, onlySelf: true });
    //this.myForm.get('control')?.setValue(newValue);
  }

  updateValue() {
    this.exampleControl.setValue('New Value aaaa', { emitEvent: false });
  }

  addSkill(skill: string, $event) {
    $event.preventDefault()

    let skillStr = skill.trim()
    if (this.skills.indexOf(skillStr) === -1) {
      this.skills.push(skillStr)
    }
  }
  createComponent(type) {
    this.dynamicContainer.clear()
    const factory: ComponentFactory<AlertComponent> =
      this.resolver.resolveComponentFactory(AlertComponent)
    this.alertComponent = this.dynamicContainer.createComponent(factory)
    this.alertComponent.instance.type = type
    this.alertComponent.instance.alertEmitter.subscribe((message) => {
      this.alertComponent.destroy()
    })
  }
  changeCardNumber($event) {
    this.creditCardNumber = $event.target.value
  }

  onSubmit() {
    console.log(this.myForm.getRawValue());
  }

  onKeyup(event: KeyboardEvent): void {
    console.log('event', event);
    const input = (event.target as HTMLInputElement).value;
    const parsedDate = new Date(input);

    if (!isNaN(parsedDate.getTime())) {
      this.myForm.get('date')!.setValue(parsedDate);
    }
  }
}
