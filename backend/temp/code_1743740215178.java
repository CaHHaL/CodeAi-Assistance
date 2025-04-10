//calc your years 
import java.time.*;
class Main{
    public static void main(String args[]){
      LocalDate pdt=LocalDate.of(1992,03,9);
       LocalDate dt=LocalDate.now();
       Period diff=Period.between(pdt,dt);
       System.out.println(pdt+" "+diff.getYears()+" "+ diff.getMonths() +" " +diff.getDays());
      
       
    }
}