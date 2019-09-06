# An app which generates random root, log and power equations to solve
# for python 3.6.2

import random
import math

import tkinter
from tkinter import *
from tkinter import ttk
#from tkinter import Tk, PhotoImage, Label, Message, Text, LEFT
import sys

from fractions import Fraction
# from decimal import Decimal

# basic class which generates the equations
class Equation:
    def __init__(self):
        self.base = 0.0;    self.baseText = ''
        self.result = 0.0;  self.resultText = ''
        self.power = 0.0;   self.powerText = ''
        self.type = ''
        self.s = ''
        self.transformInto = ''
        self.specialResult = ''

        self.sList = []
        self.sListTkinter = []

    def genAll(self):
        self.sList = []
        self.sListTkinter = []
        self.genQs(3,c=True)
        self.genQsX(3)
        r=1
        for a in equation.sListTkinter:
            # button=Button(mainw, text="Generate new equations", command=equation.genAll, relief=RIDGE, anchor=W, width=100)
            # button.grid(row=0, sticky=W)
            r = r + 1
            Label(text=a[0], relief=RIDGE, width=50, anchor=W).grid(row=r,column=0,sticky=W,padx=20)
            r = r + 1
            Label(text=a[1], width=50, anchor=W).grid(row=r,column=0,sticky=W,padx=20)
            r = r + 1
            Label(text=a[2], width=50, anchor=W).grid(row=r,column=0,sticky=W,padx=20)
            r = r + 1
            Label(text="", width=50, anchor=W).grid(row=r,column=0,sticky=W,padx=20)
            r = r + 1

    # Generates equations without unknown variables
    def genQs(self,a,c=False):
        for b in range(0,a): self.genEq(c); self.genStr()

    # Generates equations with an x
    def genQsX(self,a,c=False):
        for b in range(0,a): self.genEq(c); self.genX(); self.genStr()

    # Base method which generates the equation
    def genEq(self,c=False):
        self.type = random.choice(['log','root','power'])

        if c:
            self.base = random.choice([1,1]) * random.randint(2,10)
            self.result = random.choice([-1,1]) * random.randint(1,65) / 2.0
            self.power = random.choice([-1,1]) * random.randint(1,10) / 2.0
        else:
            self.base = random.choice([1,1]) * random.randint(2,10)
            self.result = random.choice([1,1]) * random.randint(1,65) / 2.0
            self.power = random.choice([-1,1]) * random.randint(1,10) / 2.0

        if self.type == 'log':
            if self.result < 0: self.result *= -1.0
            if self.base < 0: self.base *= -1.0
            self.base = int(self.base)
            self.power = math.log(self.result,self.base)
        elif self.type == 'root':
            self.base = self.result ** (1/self.power)
        elif self.type == 'power':
            self.result = int(self.base) ** int(self.power)

        if self.base.__class__.__name__ == 'complex': self.baseText = 'complex number'
        else: self.baseText = "%.1f"%self.base
        if self.power.__class__.__name__ == 'complex': self.powerText = 'complex number'
        else: self.powerText = "%.1f"%self.power
        if self.result.__class__.__name__ == 'complex': self.resultText = 'complex number'
        else: self.resultText = "%.1f"%self.result

    # A method which changes random variables in the equation into x
    def genX(self):
        a = random.choice(['log','root','power'])
        if a == 'log': self.powerText = 'x'
        elif a == 'root': self.baseText = 'x'
        elif a == 'power': self.resultText = 'x'

    # A methos which takes the values of the equation and outputs a text string
    def genStr(self):
        if self.type =='log':
            self.s = 'log base %s of %s = %s'%(self.baseText, self.resultText, self.powerText)
            self.transformInto = 'Transform into: power, root'
        elif self.type == 'root':
            self.s = '%s root of %s = %s'%(self.powerText, self.resultText, self.baseText)
            self.transformInto = 'Transform into: log, power'
        elif self.type == 'power':
            self.s = '%s to %s power = %s'%(self.baseText, self.powerText , self.resultText)
            self.transformInto = 'Transform into: log, root'

        #self.sListTkinter.append('Type: ' + self.type + '\n' + self.s + '\n' + self.transformInto + '\n')
        self.sListTkinter.append(['Type: ' + self.type, self.s, self.transformInto])
        self.sList.append('Type: ' + self.type + '\n' + self.s + '\n' + self.transformInto + '\n')
        print('Type: ' + self.type + '\n' + self.s + '\n' + self.transformInto + '\n')

print ('############## Generating equations to solve: ##############')
argDict = {'0':'','1':'','2':''}
for a in range(0,len(sys.argv)):
    argDict[a] = sys.argv[a]

equation = Equation()
equation.genQs(3,c=True)
equation.genQsX(3)

print(sys.argv)

colours = ['red','green','orange','white','yellow','blue']

r = 0

mainw=Tk()
mainw.geometry("400x540")
button=Button(mainw, text="Generate new equations", command=equation.genAll, relief=RIDGE, anchor=W, width=50)
button.grid(row=0, sticky=W, padx=20)
Label(text="", width=50, anchor=W).grid(row=1,column=0,sticky=W,padx=20)


mainloop()
