# include <stdio.h>
main()
{
      int b;

      b=4;
      while (b){
            if (b==4) printf("You are suddenly standing before a house full of kittens, what do you want to do? \n\n");
            else printf("The kittens are waiting, what do you want to do next? \n");
            printf("1-pet \n");
            printf("2-cuddle \n");
            printf("3-meow \n");
            printf("0-leave\n\n");
            printf("You:");
            scanf("%d",&b);
            if (b==1) printf("\nYou pet the kittens, they meow excitedly. \n\n");
            if (b==2) printf("You cuddle the kittens, they fall asleep. \n\n");
            if (b==3) printf("You meow at the kittens. Your meowing is low grade, they don't understand. \n\n");
            }
}
