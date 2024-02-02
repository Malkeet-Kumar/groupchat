#include<iostream>
using namespace std;

class Node{
public:
    int data;
    Node *next;
    Node(){
        this->data=0;
        next=NULL;
    }
    Node(int data){
        this->data=data;
        next=NULL;
    }
};

class Linklist{
    Node *head;
public: 
    Linklist(){
        Node *node = new Node();
    }

    Linklist(int data){
        Node *node = new Node(data);
    }

    void insertAtBeginning(int data){
        Node* newNode = new Node(data);
        if(head==NULL){
            head=newNode;
        } else {
            newNode->next=head;
            head=newNode;
        }
    }

    void insertAtEnd(int data){
        Node* temp = head;
        Node *newNode = new Node(data);
        if(head==NULL){
            head=newNode;
            return;
        }
        while (temp->next!=NULL){
            temp = temp->next;
        }
        temp->next=newNode;
    }

    void insertAtNth(int data, int pos){
        Node *temp = head;
        Node *newNode = new Node(data);
        if(head==NULL){
            head = newNode;
            return;
        }
        int i=1;
        while(temp->next!=NULL && i<pos-1){
            temp=temp->next;
            i++;
        }
        Node *t = temp->next;
        temp->next = newNode;
        newNode->next = t;
    }

    Node* deleteFirstNode(){
        Node* node = head;
        head = head->next;
        return node;
    }

    Node* deleteLastNode(){
        Node *temp = head;
        Node *t=NULL;
        while(temp->next->next!=NULL){
            temp=temp->next;
        }
        t=temp->next;
        temp->next=NULL;
        return t;
    }

    Node* deleteNthNode(int pos){
        Node *temp = head;
        int i=1;
        while (temp->next->next!=NULL && i<pos-1){
            temp = temp->next;
        }
        Node* t = temp->next;
        temp->next=t->next;
        return t;
    }

    Node* search(int data){
        Node* temp = head;
        while (temp->next!=NULL || temp->data!=data){
            temp=temp->next;
        }   
        return temp;
    }

    void printList(){
        Node* temp = head;
        while (temp!=NULL){
            cout<<temp->data<<" ";
            temp=temp->next;
        }       
    }
};


int main(){
    Linklist list;
    list.insertAtEnd(10);
    list.insertAtEnd(20);
    list.insertAtEnd(30);
    list.insertAtEnd(40);
    list.insertAtBeginning(5);
    list.insertAtNth(8,100);
    list.printList();
    cout<<endl;
    cout<<list.search(20)->data<<endl;
    list.printList();
    return 0;
}