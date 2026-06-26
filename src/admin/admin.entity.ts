import crypto from 'node:crypto'

export class Admin {
    public id: string;

    constructor(
        public fullname: string,          
        public role: string,              
        public seniority: number,          
        public availablehours: number,
        public salary: number,       
        public overtimehours: number,        
        public performancescore: number,    
        public assignedtasks: string[],
        id?: string
      ) {
        this.id = id ?? crypto.randomUUID();
      }

    addTask(task: string) {
        this.assignedtasks.push(task);
    }

    logOvertime(hours: number) {
        this.overtimehours += hours;
    }

    deactivate() {
        this.availablehours = 0;
        this.assignedtasks = [];
    }

    reassignTask(index: number, newTask: string) {
        if (this.assignedtasks[index]) {
            this.assignedtasks[index] = newTask;
        }
    }

    updateDetails(details: Partial<Admin>) {
        Object.assign(this, details);
    }

    getSummary() {
        return {
            fullname: this.fullname,
            role: this.role,
            seniority: this.seniority,
            availablehours: this.availablehours,
            salary: this.salary,
            overtimehours: this.overtimehours,
            performancescore: this.performancescore,
            assignedtasks: this.assignedtasks,
            id: this.id
        };
    }
}